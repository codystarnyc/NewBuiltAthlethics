import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/db';
import { success, created } from '../utils/response';
import { AppError } from '../middleware/errorHandler';

export async function getAllProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const category = req.query.category as string | undefined;
    const where = category ? { category, status: 'active' } : { status: 'active' };
    const products = await prisma.product.findMany({
      where,
      include: {
        reviews: { select: { rating: true } },
      },
    });
    const mapped = products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      imageUrl: p.imageUrl,
      price: p.price,
      gymilesPrice: p.gymilesPrice,
      category: p.category,
      vendorId: p.vendorId,
      rating: p.reviews.length ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0,
      reviewCount: p.reviews.length,
    }));
    success(res, mapped);
  } catch (err) { next(err); }
}

export async function addProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, description, imageUrl, price, gymilesPrice, category, vendorId } = req.body;
    if (!name) throw new AppError(400, 'Product name is required');
    const product = await prisma.product.create({
      data: { name, description, imageUrl, price: price ?? 0, gymilesPrice: gymilesPrice ?? 0, category, vendorId },
    });
    created(res, product);
  } catch (err) { next(err); }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { id, ...data } = req.body;
    if (!id) throw new AppError(400, 'Product id is required');
    const product = await prisma.product.update({ where: { id }, data });
    success(res, product);
  } catch (err) { next(err); }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.body;
    if (!id) throw new AppError(400, 'Product id is required');
    await prisma.product.update({ where: { id }, data: { status: 'deleted' } });
    success(res, { message: 'Product deleted' });
  } catch (err) { next(err); }
}

export async function addReview(req: Request, res: Response, next: NextFunction) {
  try {
    const { productId, email, rating, comment } = req.body;
    if (!productId || !email || rating == null) throw new AppError(400, 'productId, email, and rating required');
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) throw new AppError(404, 'User not found');

    const review = await prisma.productReview.create({
      data: { productId, userId: user.id, rating, comment },
    });
    created(res, review);
  } catch (err) { next(err); }
}
