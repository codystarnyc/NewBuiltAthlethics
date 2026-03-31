import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import type { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { s3Client } from '../config/s3';
import { env } from '../config/env';
import { AppError } from './errorHandler';

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic'];
const VIDEO_MIME_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];

const imageFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (IMAGE_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(400, `Invalid image format. Accepted: ${IMAGE_MIME_TYPES.join(', ')}`));
  }
};

const videoFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (VIDEO_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(400, `Invalid video format. Accepted: ${VIDEO_MIME_TYPES.join(', ')}`));
  }
};

function createS3Storage(prefix: string) {
  return multerS3({
    s3: s3Client as any,
    bucket: env.aws.s3BucketUploads,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key(_req, file, cb) {
      const ext = path.extname(file.originalname);
      const key = `${prefix}/${uuidv4()}${ext}`;
      cb(null, key);
    },
  });
}

const rawImageUpload = multer({
  storage: createS3Storage('images'),
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single('image');

const rawVideoUpload = multer({
  storage: createS3Storage('videos'),
  fileFilter: videoFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
}).single('video');

function wrapMulter(upload: ReturnType<typeof multer>['single'] extends (...args: any) => infer R ? R : never) {
  return (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (err: any) => {
      if (err) {
        console.error('Multer/S3 upload error:', err);
        return next(new AppError(err.statusCode ?? 500, err.message ?? 'Upload failed'));
      }
      next();
    });
  };
}

export const uploadImage = wrapMulter(rawImageUpload);
export const uploadVideo = wrapMulter(rawVideoUpload);
