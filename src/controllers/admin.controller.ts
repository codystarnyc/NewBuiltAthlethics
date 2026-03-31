import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { prisma } from '../services/db';
import { env } from '../config/env';
import { success, created } from '../utils/response';
import { AppError } from '../middleware/errorHandler';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '../config/s3';

const signOpts: SignOptions = { expiresIn: env.jwt.expiresIn as SignOptions['expiresIn'] };

// ─── Admin Auth ──────────────────────────────────────────

export async function adminLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new AppError(400, 'Email and password required');

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isTrainer) throw new AppError(403, 'Not authorized as admin');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AppError(401, 'Invalid credentials');

    const token = jwt.sign({ userId: user.id, email: user.email }, env.jwt.secret, signOpts);
    success(res, { token, email: user.email, name: user.name });
  } catch (err) { next(err); }
}

// ─── Stats ───────────────────────────────────────────────

export async function getStats(_req: Request, res: Response, next: NextFunction) {
  try {
    const [users, categories, exercises, foods, products] = await Promise.all([
      prisma.user.count(),
      prisma.category.count({ where: { status: 'active' } }),
      prisma.exercise.count({ where: { status: 'active' } }),
      prisma.food.count(),
      prisma.product.count({ where: { status: 'active' } }),
    ]);
    success(res, { users, categories, exercises, foods, products });
  } catch (err) { next(err); }
}

// ─── Category CRUD with image upload ─────────────────────

export async function listCategories(_req: Request, res: Response, next: NextFunction) {
  try {
    const cats = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { exercises: true } } },
    });
    success(res, cats.map((c) => ({ ...c, exerciseCount: c._count.exercises })));
  } catch (err) { next(err); }
}

export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, sortOrder } = req.body;
    if (!name) throw new AppError(400, 'Name required');

    const file = req.file as Express.MulterS3.File | undefined;
    const imageUrl = file ? (file.location ?? await presign(file.key)) : req.body.imageUrl ?? null;

    const cat = await prisma.category.create({
      data: { name, imageUrl, sortOrder: Number(sortOrder) || 0 },
    });
    created(res, cat);
  } catch (err) { next(err); }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const id = paramId(req);
    const { name, sortOrder, status } = req.body;

    const file = req.file as Express.MulterS3.File | undefined;
    const imageUrl = file ? (file.location ?? await presign(file.key)) : undefined;

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (sortOrder !== undefined) data.sortOrder = Number(sortOrder);
    if (status !== undefined) data.status = status;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;

    const cat = await prisma.category.update({ where: { id }, data });
    success(res, cat);
  } catch (err) { next(err); }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const id = paramId(req);
    await prisma.category.update({ where: { id }, data: { status: 'deleted' } });
    success(res, { message: 'Deleted' });
  } catch (err) { next(err); }
}

// ─── Exercise CRUD with image + video upload ─────────────

export async function listExercises(req: Request, res: Response, next: NextFunction) {
  try {
    const categoryId = req.query.categoryId as string | undefined;
    const where: Record<string, unknown> = {};
    if (categoryId) where.categoryId = categoryId;

    const exercises = await prisma.exercise.findMany({
      where,
      include: { category: { select: { name: true } } },
      orderBy: { name: 'asc' },
    });
    success(res, exercises.map((e) => ({ ...e, categoryName: e.category.name })));
  } catch (err) { next(err); }
}

export async function createExercise(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, categoryId, description } = req.body;
    if (!name || !categoryId) throw new AppError(400, 'name and categoryId required');

    const files = req.files as Record<string, Express.MulterS3.File[]> | undefined;
    const imageFile = files?.image?.[0];
    const videoFile = files?.video?.[0];

    const imageUrl = imageFile
      ? (imageFile.location ?? await presign(imageFile.key))
      : req.body.imageUrl ?? null;
    const videoUrl = videoFile
      ? (videoFile.location ?? await presign(videoFile.key))
      : req.body.videoUrl ?? null;

    const exercise = await prisma.exercise.create({
      data: { name, categoryId, description, imageUrl, videoUrl },
    });
    created(res, exercise);
  } catch (err) { next(err); }
}

export async function updateExercise(req: Request, res: Response, next: NextFunction) {
  try {
    const id = paramId(req);
    const { name, categoryId, description, status } = req.body;

    const files = req.files as Record<string, Express.MulterS3.File[]> | undefined;
    const imageFile = files?.image?.[0];
    const videoFile = files?.video?.[0];

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (categoryId !== undefined) data.categoryId = categoryId;
    if (description !== undefined) data.description = description;
    if (status !== undefined) data.status = status;

    if (imageFile) data.imageUrl = imageFile.location ?? await presign(imageFile.key);
    else if (req.body.imageUrl !== undefined) data.imageUrl = req.body.imageUrl;

    if (videoFile) data.videoUrl = videoFile.location ?? await presign(videoFile.key);
    else if (req.body.videoUrl !== undefined) data.videoUrl = req.body.videoUrl;

    const exercise = await prisma.exercise.update({ where: { id }, data });
    success(res, exercise);
  } catch (err) { next(err); }
}

export async function deleteExercise(req: Request, res: Response, next: NextFunction) {
  try {
    const id = paramId(req);
    await prisma.exercise.update({ where: { id }, data: { status: 'deleted' } });
    success(res, { message: 'Deleted' });
  } catch (err) { next(err); }
}

// ─── Users list ──────────────────────────────────────────

export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const offset = Number(req.query.offset) || 0;
    const users = await prisma.user.findMany({
      take: limit,
      skip: offset,
      select: {
        id: true, email: true, name: true, gender: true, weight: true, height: true,
        fitnessGoal: true, gymiles: true, isSubscribed: true, isTrainer: true, createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    const total = await prisma.user.count();
    success(res, { users, total });
  } catch (err) { next(err); }
}

// ─── Foods management ────────────────────────────────────

export async function listFoods(req: Request, res: Response, next: NextFunction) {
  try {
    const q = (req.query.q as string ?? '').trim();
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const offset = Number(req.query.offset) || 0;

    const where = q
      ? { OR: [{ name: { contains: q, mode: 'insensitive' as const } }, { brand: { contains: q, mode: 'insensitive' as const } }] }
      : {};

    const [foods, total] = await Promise.all([
      prisma.food.findMany({ where, take: limit, skip: offset, orderBy: { name: 'asc' } }),
      prisma.food.count({ where }),
    ]);
    success(res, { foods, total });
  } catch (err) { next(err); }
}

// ─── Products management ─────────────────────────────────

export async function listProducts(_req: Request, res: Response, next: NextFunction) {
  try {
    const products = await prisma.product.findMany({ orderBy: { name: 'asc' } });
    success(res, products);
  } catch (err) { next(err); }
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, description, price, gymilesPrice, category, vendorId } = req.body;
    if (!name) throw new AppError(400, 'Name required');
    const file = req.file as Express.MulterS3.File | undefined;
    const imageUrl = file ? (file.location ?? await presign(file.key)) : req.body.imageUrl ?? null;

    const product = await prisma.product.create({
      data: { name, description, imageUrl, price: Number(price) || 0, gymilesPrice: Number(gymilesPrice) || 0, category, vendorId },
    });
    created(res, product);
  } catch (err) { next(err); }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const id = paramId(req);
    const { name, description, price, gymilesPrice, category, vendorId, status } = req.body;
    const file = req.file as Express.MulterS3.File | undefined;

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = Number(price);
    if (gymilesPrice !== undefined) data.gymilesPrice = Number(gymilesPrice);
    if (category !== undefined) data.category = category;
    if (vendorId !== undefined) data.vendorId = vendorId;
    if (status !== undefined) data.status = status;
    if (file) data.imageUrl = file.location ?? await presign(file.key);

    const product = await prisma.product.update({ where: { id }, data });
    success(res, product);
  } catch (err) { next(err); }
}

// ─── Helpers ─────────────────────────────────────────────

function paramId(req: Request): string {
  const v = req.params.id;
  return Array.isArray(v) ? v[0] : v;
}

async function presign(key: string): Promise<string> {
  const cmd = new GetObjectCommand({ Bucket: env.aws.s3BucketUploads, Key: key });
  return getSignedUrl(s3Client, cmd, { expiresIn: 604800 });
}
