import type { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '../config/s3';
import { env } from '../config/env';
import { enqueueProcessing, getResult, getAllResults } from '../services/processing/queue';
import { success, fail, created } from '../utils/response';
import type { ImageType, UploadResult } from '../types';
import { AppError } from '../middleware/errorHandler';

const uploads = new Map<string, UploadResult>();

export async function handleImageUpload(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file as Express.MulterS3.File | undefined;
    if (!file) {
      return fail(res, 'No image file provided', 400);
    }

    const type = (req.body.type as ImageType) ?? 'food';
    if (!['food', 'receipt', 'body'].includes(type)) {
      return fail(res, 'Invalid type. Must be: food, receipt, or body', 400);
    }

    const id = uuidv4();
    const imageUrl = file.location ?? await generatePresignedUrl(file.key);

    const upload: UploadResult = {
      id,
      url: imageUrl,
      key: file.key,
      type,
      status: 'pending',
      userId: req.user?.userId,
      createdAt: new Date(),
    };

    uploads.set(id, upload);

    upload.status = 'processing';
    await enqueueProcessing(id, imageUrl, type);

    created(res, {
      id,
      url: imageUrl,
      type,
      status: 'processing',
      message: 'Image uploaded and queued for AI processing',
    });
  } catch (err) {
    next(err);
  }
}

export async function handleVideoUpload(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file as Express.MulterS3.File | undefined;
    if (!file) {
      return fail(res, 'No video file provided', 400);
    }

    const id = uuidv4();
    const videoUrl = file.location ?? await generatePresignedUrl(file.key);

    const upload: UploadResult = {
      id,
      url: videoUrl,
      key: file.key,
      type: 'food',
      status: 'completed',
      userId: req.user?.userId,
      createdAt: new Date(),
    };

    uploads.set(id, upload);

    created(res, {
      id,
      url: videoUrl,
      key: file.key,
      message: 'Video uploaded successfully',
    });
  } catch (err) {
    next(err);
  }
}

export async function getProcessingResult(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const result = getResult(id);

    if (!result) {
      return fail(res, 'Processing result not found', 404);
    }

    success(res, result);
  } catch (err) {
    next(err);
  }
}

export async function listResults(req: Request, res: Response, next: NextFunction) {
  try {
    const results = getAllResults();
    success(res, results);
  } catch (err) {
    next(err);
  }
}

async function generatePresignedUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: env.aws.s3BucketUploads,
    Key: key,
  });
  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}
