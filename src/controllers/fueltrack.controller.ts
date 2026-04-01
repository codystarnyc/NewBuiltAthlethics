import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/db';
import { success, created } from '../utils/response';
import { AppError } from '../middleware/errorHandler';
import { recalculateDay, getHistory } from '../services/fueltrack/engine';

async function resolveUserId(email: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) throw new AppError(404, 'User not found');
  return user.id;
}

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getToday(req: Request, res: Response, next: NextFunction) {
  try {
    const email = req.query.email as string;
    if (!email) throw new AppError(400, 'email is required');
    const userId = await resolveUserId(email);
    const date = (req.query.date as string) || todayDate();

    const existing = await prisma.fuelTrackDay.findUnique({
      where: { userId_date: { userId, date } },
    });

    if (existing) {
      success(res, existing);
      return;
    }

    const breakdown = await recalculateDay(userId, date);
    const record = await prisma.fuelTrackDay.findUnique({
      where: { userId_date: { userId, date } },
    });

    success(res, record ?? breakdown);
  } catch (err) { next(err); }
}

export async function getScoreHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const email = req.query.email as string;
    if (!email) throw new AppError(400, 'email is required');
    const userId = await resolveUserId(email);
    const days = Math.min(Number(req.query.days) || 7, 90);

    const history = await getHistory(userId, days);
    success(res, history);
  } catch (err) { next(err); }
}

export async function logWalk(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, type, startTime, durationMin, steps, source, mealType } = req.body;
    if (!email) throw new AppError(400, 'email is required');
    if (!type || !startTime || !durationMin) {
      throw new AppError(400, 'type, startTime, and durationMin are required');
    }

    const userId = await resolveUserId(email);
    const start = new Date(startTime);
    const date = start.toISOString().slice(0, 10);

    const walk = await prisma.walkLog.create({
      data: {
        userId,
        date,
        type,
        startTime: start,
        durationMin,
        steps: steps ?? null,
        source: source ?? 'manual',
        mealType: mealType ?? null,
      },
    });

    await recalculateDay(userId, date);

    created(res, walk);
  } catch (err) { next(err); }
}

export async function syncHealth(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, date, walks } = req.body;
    if (!email) throw new AppError(400, 'email is required');
    if (!date) throw new AppError(400, 'date is required');

    const userId = await resolveUserId(email);

    const created_walks = [];
    if (walks && Array.isArray(walks)) {
      for (const w of walks) {
        const start = new Date(w.startTime);
        const walk = await prisma.walkLog.create({
          data: {
            userId,
            date,
            type: w.type,
            startTime: start,
            durationMin: w.durationMin,
            steps: w.steps ?? null,
            source: w.source ?? 'apple_health',
            mealType: w.mealType ?? null,
          },
        });
        created_walks.push(walk);
      }
    }

    const breakdown = await recalculateDay(userId, date);

    success(res, { walks: created_walks, score: breakdown });
  } catch (err) { next(err); }
}

export async function recalculate(req: Request, res: Response, next: NextFunction) {
  try {
    const email = req.query.email as string;
    const date = (req.query.date as string) || todayDate();
    if (!email) throw new AppError(400, 'email is required');

    const userId = await resolveUserId(email);
    const breakdown = await recalculateDay(userId, date);
    success(res, breakdown);
  } catch (err) { next(err); }
}
