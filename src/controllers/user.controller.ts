import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/db';
import { success } from '../utils/response';
import { AppError } from '../middleware/errorHandler';

function selectPublic() {
  return {
    id: true,
    email: true,
    name: true,
    gender: true,
    weight: true,
    height: true,
    dateOfBirth: true,
    gym: true,
    fitnessGoal: true,
    gymFrequency: true,
    gymDays: true,
    autoTracking: true,
    isTrainer: true,
    promoCode: true,
    referralCode: true,
    gymiles: true,
    imageUrl: true,
    isSubscribed: true,
    subscriptionType: true,
  } as const;
}

async function findUser(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: selectPublic(),
  });
  if (!user) throw new AppError(404, 'User not found');
  return user;
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const email = (req.query.email ?? req.body.email) as string;
    if (!email) throw new AppError(400, 'Email is required');
    success(res, await findUser(email));
  } catch (err) { next(err); }
}

export async function getUserDetails(req: Request, res: Response, next: NextFunction) {
  try {
    const email = (req.query.email ?? req.body.email) as string;
    if (!email) throw new AppError(400, 'Email is required');
    success(res, await findUser(email));
  } catch (err) { next(err); }
}

export async function getUserHome(req: Request, res: Response, next: NextFunction) {
  try {
    const email = (req.query.email ?? req.body.email) as string;
    if (!email) throw new AppError(400, 'Email is required');

    const user = await findUser(email);
    const today = new Date().toISOString().slice(0, 10);
    const diary = await prisma.foodDiaryEntry.findMany({
      where: { userId: user.id, date: { gte: new Date(`${today}T00:00:00Z`) } },
    });

    const todayNutrition = diary.reduce(
      (acc, e) => ({
        calories: acc.calories + e.calories,
        protein: acc.protein + e.protein,
        carbs: acc.carbs + e.carbs,
        fat: acc.fat + e.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );

    success(res, { ...user, todayNutrition });
  } catch (err) { next(err); }
}

export async function getCalendarDates(req: Request, res: Response, next: NextFunction) {
  try {
    const email = (req.query.email ?? req.body.email) as string;
    if (!email) throw new AppError(400, 'Email is required');
    const user = await findUser(email);
    const entries = await prisma.foodDiaryEntry.findMany({
      where: { userId: user.id },
      select: { date: true },
      distinct: ['date'],
    });
    const dates = entries.map((e) => e.date.toISOString().slice(0, 10));
    success(res, dates);
  } catch (err) { next(err); }
}

export async function getUserHealthInfo(req: Request, res: Response, next: NextFunction) {
  try {
    const email = (req.query.email ?? req.body.email) as string;
    const date = (req.query.date ?? req.body.date) as string;
    if (!email) throw new AppError(400, 'Email is required');

    const user = await findUser(email);
    const record = await prisma.healthRecord.findUnique({
      where: { userId_date: { userId: user.id, date: date ?? new Date().toISOString().slice(0, 10) } },
    });

    success(res, {
      email,
      date,
      steps: record?.steps ?? 0,
      pulse: record?.heartRate ?? 0,
      calories: record?.calories ?? 0,
    });
  } catch (err) { next(err); }
}

type FieldUpdate = Record<string, unknown>;

async function updateUserField(req: Request, res: Response, next: NextFunction, data: FieldUpdate) {
  try {
    const email = req.body.email as string;
    if (!email) throw new AppError(400, 'Email is required');
    await prisma.user.update({ where: { email }, data });
    success(res, { message: 'Updated' });
  } catch (err) { next(err); }
}

export const setName = (req: Request, res: Response, next: NextFunction) =>
  updateUserField(req, res, next, { name: req.body.name });

export const setGender = (req: Request, res: Response, next: NextFunction) =>
  updateUserField(req, res, next, { gender: req.body.gender });

export const setWeight = (req: Request, res: Response, next: NextFunction) =>
  updateUserField(req, res, next, { weight: Number(req.body.weight) });

export const setHeight = (req: Request, res: Response, next: NextFunction) =>
  updateUserField(req, res, next, { height: Number(req.body.height) });

export const setDateOfBirth = (req: Request, res: Response, next: NextFunction) =>
  updateUserField(req, res, next, { dateOfBirth: req.body.dateOfBirth });

export const setGym = (req: Request, res: Response, next: NextFunction) =>
  updateUserField(req, res, next, { gym: req.body.gym });

export const setFitnessGoal = (req: Request, res: Response, next: NextFunction) =>
  updateUserField(req, res, next, { fitnessGoal: req.body.fitnessGoal });

export const setGymFrequency = (req: Request, res: Response, next: NextFunction) =>
  updateUserField(req, res, next, { gymFrequency: req.body.gymFrequency });

export const setGymDays = (req: Request, res: Response, next: NextFunction) =>
  updateUserField(req, res, next, { gymDays: req.body.gymDays });

export const setAutoTracking = (req: Request, res: Response, next: NextFunction) =>
  updateUserField(req, res, next, { autoTracking: Boolean(req.body.autoTracking) });

export const setAsTrainer = (req: Request, res: Response, next: NextFunction) =>
  updateUserField(req, res, next, { isTrainer: Boolean(req.body.isTrainer) });

export const setWorkoutConfig = (_req: Request, res: Response, _next: NextFunction) => {
  success(res, { message: 'Workout config updated' });
};

export const setPushToken = (req: Request, res: Response, next: NextFunction) =>
  updateUserField(req, res, next, { pushToken: req.body.token });

export const setPushTokenFCM = (req: Request, res: Response, next: NextFunction) =>
  updateUserField(req, res, next, { pushTokenFcm: req.body.token });

export async function addStepsDay(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, date, steps } = req.body;
    if (!email || !date) throw new AppError(400, 'Email and date are required');
    const user = await findUser(email);
    await prisma.healthRecord.upsert({
      where: { userId_date: { userId: user.id, date } },
      update: { steps },
      create: { userId: user.id, date, steps },
    });
    success(res, { message: 'Steps recorded' });
  } catch (err) { next(err); }
}

export async function addPulseDay(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, date, pulse } = req.body;
    if (!email || !date) throw new AppError(400, 'Email and date are required');
    const user = await findUser(email);
    await prisma.healthRecord.upsert({
      where: { userId_date: { userId: user.id, date } },
      update: { heartRate: pulse },
      create: { userId: user.id, date, heartRate: pulse },
    });
    success(res, { message: 'Pulse recorded' });
  } catch (err) { next(err); }
}

export async function getWelcomeData(req: Request, res: Response, next: NextFunction) {
  try {
    const email = (req.query.email ?? req.body.email) as string;
    if (!email) throw new AppError(400, 'Email is required');
    const user = await findUser(email);
    success(res, { name: user.name, gymiles: user.gymiles, isSubscribed: user.isSubscribed });
  } catch (err) { next(err); }
}
