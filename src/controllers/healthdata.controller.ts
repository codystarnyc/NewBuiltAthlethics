import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/db';
import { success } from '../utils/response';
import { AppError } from '../middleware/errorHandler';

async function resolveUserId(email: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) throw new AppError(404, 'User not found');
  return user.id;
}

export async function setHealthData(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, date, steps, heartRate, calories, distance, activeMinutes } = req.body;
    if (!email || !date) throw new AppError(400, 'email and date required');
    const userId = await resolveUserId(email);

    await prisma.healthRecord.upsert({
      where: { userId_date: { userId, date } },
      update: { steps, heartRate, calories, distance, activeMinutes },
      create: { userId, date, steps, heartRate, calories, distance, activeMinutes },
    });
    success(res, { message: 'Health data saved' });
  } catch (err) { next(err); }
}

export async function getHealthData(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, date } = req.body;
    if (!email || !date) throw new AppError(400, 'email and date required');
    const userId = await resolveUserId(email);

    const record = await prisma.healthRecord.findUnique({
      where: { userId_date: { userId, date } },
    });
    success(res, record ?? { email, date, steps: 0, heartRate: 0, calories: 0, distance: 0, activeMinutes: 0 });
  } catch (err) { next(err); }
}
