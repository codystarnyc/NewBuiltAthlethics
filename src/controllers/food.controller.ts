import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/db';
import { success, created } from '../utils/response';
import { AppError } from '../middleware/errorHandler';
import { recalculateDay } from '../services/fueltrack/engine';

// ─── Food database ───────────────────────────────────────

export async function getAllFoods(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const offset = Number(req.query.offset) || 0;
    const foods = await prisma.food.findMany({ take: limit, skip: offset, orderBy: { name: 'asc' } });
    success(res, foods);
  } catch (err) { next(err); }
}

export async function addFood(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, brand, barcode, calories, protein, carbs, fat, fiber, sugar, sodium, servingSize, servingUnit, imageUrl } = req.body;
    if (!name) throw new AppError(400, 'Food name is required');

    const food = await prisma.food.create({
      data: {
        name, brand, barcode,
        calories: calories ?? 0, protein: protein ?? 0, carbs: carbs ?? 0, fat: fat ?? 0,
        fiber, sugar, sodium,
        servingSize, servingUnit, imageUrl,
        searchData: `${name} ${brand ?? ''}`.toLowerCase(),
      },
    });
    created(res, food);
  } catch (err) { next(err); }
}

export async function updateFood(req: Request, res: Response, next: NextFunction) {
  try {
    const { id, ...data } = req.body;
    if (!id) throw new AppError(400, 'Food id is required');
    const food = await prisma.food.update({ where: { id }, data });
    success(res, food);
  } catch (err) { next(err); }
}

export async function getFoodByBarcode(req: Request, res: Response, next: NextFunction) {
  try {
    const barcode = (req.query.barcode ?? req.body.barcode) as string;
    if (!barcode) throw new AppError(400, 'Barcode is required');
    const food = await prisma.food.findUnique({ where: { barcode } });
    if (!food) throw new AppError(404, 'Food not found for barcode');
    success(res, food);
  } catch (err) { next(err); }
}

export async function searchFoodByText(req: Request, res: Response, next: NextFunction) {
  try {
    const q = ((req.query.q ?? req.body.q ?? req.query.query ?? req.body.query) as string ?? '').trim();
    if (!q) { success(res, []); return; }

    const foods = await prisma.food.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { brand: { contains: q, mode: 'insensitive' } },
          { searchData: { contains: q.toLowerCase() } },
        ],
      },
      take: 30,
    });
    success(res, foods);
  } catch (err) { next(err); }
}

// ─── Food Diary ──────────────────────────────────────────

async function resolveUserId(email: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) throw new AppError(404, 'User not found');
  return user.id;
}

export async function getFoodDiary(req: Request, res: Response, next: NextFunction) {
  try {
    const email = (req.query.email ?? req.body.email) as string;
    const date = (req.query.date ?? req.body.date) as string;
    if (!email) throw new AppError(400, 'email is required');
    const userId = await resolveUserId(email);

    const dayStart = date ? new Date(`${date}T00:00:00Z`) : new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00Z');
    const dayEnd = new Date(dayStart.getTime() + 86400000);

    const entries = await prisma.foodDiaryEntry.findMany({
      where: { userId, date: { gte: dayStart, lt: dayEnd } },
      orderBy: { createdAt: 'asc' },
    });
    success(res, entries);
  } catch (err) { next(err); }
}

export async function setFoodDiary(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, date, mealTime, mealType, foodName, calories, protein, carbs, fat, servingSize, notes, imageUrl, uploadId } = req.body;
    if (!email || !mealType || !foodName) throw new AppError(400, 'email, mealType, and foodName required');
    const userId = await resolveUserId(email);

    const entryDate = date ? new Date(date) : new Date();
    const resolvedMealTime = mealTime ? new Date(mealTime) : entryDate;
    const entry = await prisma.foodDiaryEntry.create({
      data: {
        userId,
        date: entryDate,
        mealTime: resolvedMealTime,
        mealType, foodName,
        calories: calories ?? 0,
        protein: protein ?? 0,
        carbs: carbs ?? 0,
        fat: fat ?? 0,
        servingSize, notes, imageUrl, uploadId,
      },
    });

    const dateStr = entryDate.toISOString().slice(0, 10);
    recalculateDay(userId, dateStr).catch(() => {});

    created(res, entry);
  } catch (err) { next(err); }
}

export async function deleteFoodDiary(req: Request, res: Response, next: NextFunction) {
  try {
    const { id, email } = req.body;
    if (!id) throw new AppError(400, 'Diary entry id is required');
    if (email) {
      const userId = await resolveUserId(email);
      const entry = await prisma.foodDiaryEntry.findFirst({ where: { id, userId } });
      if (!entry) throw new AppError(404, 'Entry not found');
    }
    await prisma.foodDiaryEntry.delete({ where: { id } });
    success(res, { message: 'Diary entry deleted' });
  } catch (err) { next(err); }
}
