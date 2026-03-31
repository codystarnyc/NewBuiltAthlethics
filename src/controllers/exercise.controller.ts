import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/db';
import { success, created } from '../utils/response';
import { AppError } from '../middleware/errorHandler';

// ─── Categories ──────────────────────────────────────────

export async function getCategories(_req: Request, res: Response, next: NextFunction) {
  try {
    const cats = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
    success(res, cats);
  } catch (err) { next(err); }
}

export async function getCategoriesForApp(_req: Request, res: Response, next: NextFunction) {
  try {
    const cats = await prisma.category.findMany({
      where: { status: 'active' },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { exercises: true } } },
    });
    const mapped = cats.map((c) => ({
      id: c.id,
      name: c.name,
      imageUrl: c.imageUrl,
      cntExercise: c._count.exercises,
      status: c.status,
    }));
    success(res, mapped);
  } catch (err) { next(err); }
}

export async function addCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, imageUrl, sortOrder } = req.body;
    if (!name) throw new AppError(400, 'Name is required');
    const cat = await prisma.category.create({
      data: { name, imageUrl, sortOrder: sortOrder ?? 0 },
    });
    created(res, cat);
  } catch (err) { next(err); }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { id, name, imageUrl, sortOrder, status } = req.body;
    if (!id) throw new AppError(400, 'Category id is required');
    const cat = await prisma.category.update({
      where: { id },
      data: { name, imageUrl, sortOrder, status },
    });
    success(res, cat);
  } catch (err) { next(err); }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.body;
    if (!id) throw new AppError(400, 'Category id is required');
    await prisma.category.delete({ where: { id } });
    success(res, { message: 'Category deleted' });
  } catch (err) { next(err); }
}

// ─── Exercises ───────────────────────────────────────────

export async function getAllExercisesForApp(_req: Request, res: Response, next: NextFunction) {
  try {
    const exercises = await prisma.exercise.findMany({
      where: { status: 'active' },
      include: { category: { select: { name: true } } },
    });
    const mapped = exercises.map((e) => ({
      id: e.id,
      name: e.name,
      categoryId: e.categoryId,
      categoryName: e.category.name,
      description: e.description,
      imageUrl: e.imageUrl,
      videoUrl: e.videoUrl,
      isCustom: e.isCustom,
      status: e.status,
    }));
    success(res, mapped);
  } catch (err) { next(err); }
}

export async function getExercisesByCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { categoryId } = req.body;
    if (!categoryId) throw new AppError(400, 'categoryId is required');
    const exercises = await prisma.exercise.findMany({
      where: { categoryId, status: 'active' },
      include: { category: { select: { name: true } } },
    });
    const mapped = exercises.map((e) => ({
      id: e.id,
      name: e.name,
      categoryId: e.categoryId,
      categoryName: e.category.name,
      description: e.description,
      imageUrl: e.imageUrl,
      videoUrl: e.videoUrl,
      isCustom: e.isCustom,
      status: e.status,
    }));
    success(res, mapped);
  } catch (err) { next(err); }
}

export async function addExercise(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, categoryId, description, imageUrl, videoUrl } = req.body;
    if (!name || !categoryId) throw new AppError(400, 'name and categoryId are required');
    const exercise = await prisma.exercise.create({
      data: { name, categoryId, description, imageUrl, videoUrl },
    });
    created(res, exercise);
  } catch (err) { next(err); }
}

export async function updateExercise(req: Request, res: Response, next: NextFunction) {
  try {
    const { id, name, categoryId, description, imageUrl, videoUrl, status } = req.body;
    if (!id) throw new AppError(400, 'Exercise id is required');
    const exercise = await prisma.exercise.update({
      where: { id },
      data: { name, categoryId, description, imageUrl, videoUrl, status },
    });
    success(res, exercise);
  } catch (err) { next(err); }
}

export async function deleteExercise(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.body;
    if (!id) throw new AppError(400, 'Exercise id is required');
    await prisma.exercise.update({ where: { id }, data: { status: 'deleted' } });
    success(res, { message: 'Exercise deleted' });
  } catch (err) { next(err); }
}

export async function getExercise(req: Request, res: Response, next: NextFunction) {
  try {
    const id = (req.query.id ?? req.body.id) as string;
    if (!id) throw new AppError(400, 'Exercise id is required');
    const exercise = await prisma.exercise.findUnique({ where: { id } });
    if (!exercise) throw new AppError(404, 'Exercise not found');
    success(res, exercise);
  } catch (err) { next(err); }
}

export async function setViewVideo(_req: Request, res: Response) {
  success(res, { message: 'View recorded' });
}

export async function getInsights(_req: Request, res: Response, next: NextFunction) {
  try {
    const totalExercises = await prisma.exercise.count({ where: { status: 'active' } });
    const totalCategories = await prisma.category.count({ where: { status: 'active' } });
    success(res, { totalExercises, totalCategories });
  } catch (err) { next(err); }
}

// ─── BA Workouts ─────────────────────────────────────────

async function resolveUserId(email: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) throw new AppError(404, 'User not found');
  return user.id;
}

export async function addWorkout(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, exerciseId, exerciseName, date, sets } = req.body;
    if (!email || !exerciseId) throw new AppError(400, 'email and exerciseId required');
    const userId = await resolveUserId(email);

    const workout = await prisma.workout.create({
      data: { userId, exerciseId, exerciseName: exerciseName ?? '', date, sets: sets ?? [] },
    });
    created(res, { ...workout, email });
  } catch (err) { next(err); }
}

export async function getWorkout(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, date } = req.body;
    if (!email) throw new AppError(400, 'email is required');
    const userId = await resolveUserId(email);

    const where: Record<string, unknown> = { userId };
    if (date) where.date = date;

    const workouts = await prisma.workout.findMany({ where, orderBy: { createdAt: 'desc' } });
    success(res, workouts.map((w) => ({ ...w, email })));
  } catch (err) { next(err); }
}

export async function getWorkoutByExerciseId(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, exerciseId } = req.body;
    if (!email || !exerciseId) throw new AppError(400, 'email and exerciseId required');
    const userId = await resolveUserId(email);

    const workouts = await prisma.workout.findMany({
      where: { userId, exerciseId },
      orderBy: { createdAt: 'desc' },
    });
    success(res, workouts.map((w) => ({ ...w, email })));
  } catch (err) { next(err); }
}

export async function updateWorkout(req: Request, res: Response, next: NextFunction) {
  try {
    const { id, sets, notes, exerciseName } = req.body;
    if (!id) throw new AppError(400, 'Workout id is required');
    const workout = await prisma.workout.update({
      where: { id },
      data: { sets, notes, exerciseName },
    });
    success(res, workout);
  } catch (err) { next(err); }
}

export async function deleteWorkout(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.body;
    if (!id) throw new AppError(400, 'Workout id is required');
    await prisma.workout.delete({ where: { id } });
    success(res, { message: 'Workout deleted' });
  } catch (err) { next(err); }
}

// ─── Custom Exercises ────────────────────────────────────

export async function addCustomExercise(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, name, categoryId, notes } = req.body;
    if (!email || !name) throw new AppError(400, 'email and name required');
    const userId = await resolveUserId(email);

    const ce = await prisma.customExercise.create({
      data: { userId, name, categoryId, notes },
    });
    created(res, { ...ce, email });
  } catch (err) { next(err); }
}

export async function getCustomExercises(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    if (!email) throw new AppError(400, 'email is required');
    const userId = await resolveUserId(email);

    const items = await prisma.customExercise.findMany({ where: { userId } });
    success(res, items.map((i) => ({ ...i, email })));
  } catch (err) { next(err); }
}

export async function deleteCustomExercise(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.body;
    if (!id) throw new AppError(400, 'id is required');
    await prisma.customExercise.delete({ where: { id } });
    success(res, { message: 'Custom exercise deleted' });
  } catch (err) { next(err); }
}

export async function updateCustomExercise(req: Request, res: Response, next: NextFunction) {
  try {
    const { id, name, categoryId, notes } = req.body;
    if (!id) throw new AppError(400, 'id is required');
    const ce = await prisma.customExercise.update({
      where: { id },
      data: { name, categoryId, notes },
    });
    success(res, ce);
  } catch (err) { next(err); }
}
