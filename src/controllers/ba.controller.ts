import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/db';
import { success, created } from '../utils/response';
import { AppError } from '../middleware/errorHandler';

async function resolveUserId(email: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) throw new AppError(404, 'User not found');
  return user.id;
}

// ─── Meal Plan (BA-persisted) ────────────────────────────

export async function setMealPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, mealPlan } = req.body;
    if (!email) throw new AppError(400, 'email is required');
    const userId = await resolveUserId(email);

    await prisma.userMealPlan.upsert({
      where: { id: userId },
      update: { planData: mealPlan },
      create: { userId, planData: mealPlan },
    });
    success(res, { message: 'Meal plan saved' });
  } catch (err) { next(err); }
}

export async function getMealPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    if (!email) throw new AppError(400, 'email is required');
    const userId = await resolveUserId(email);

    const plan = await prisma.userMealPlan.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
    success(res, plan?.planData ?? null);
  } catch (err) { next(err); }
}

// ─── Ingredients / Recipes ───────────────────────────────

export async function setIngredients(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    if (!email) throw new AppError(400, 'email is required');
    success(res, { message: 'Ingredients saved' });
  } catch (err) { next(err); }
}

export async function getIngredients(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    if (!email) throw new AppError(400, 'email is required');
    const userId = await resolveUserId(email);

    const plan = await prisma.userMealPlan.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    const planData = plan?.planData as Record<string, unknown> | null;
    const meals = (planData?.meals ?? []) as Array<Record<string, unknown>>;
    const ingredients = meals.flatMap((m) =>
      ((m.ingredients ?? []) as Array<Record<string, unknown>>),
    );
    success(res, ingredients);
  } catch (err) { next(err); }
}

export async function getRecipes(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    if (!email) throw new AppError(400, 'email is required');
    const userId = await resolveUserId(email);

    const plan = await prisma.userMealPlan.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    const planData = plan?.planData as Record<string, unknown> | null;
    const days = (planData?.days ?? planData?.meals ?? []) as Array<Record<string, unknown>>;
    const recipes: Array<Record<string, unknown>> = [];
    for (const day of days) {
      const meals = (day.meals ?? []) as Array<Record<string, unknown>>;
      for (const meal of meals) {
        recipes.push(meal);
      }
    }
    success(res, recipes);
  } catch (err) { next(err); }
}

// ─── Shopping List ───────────────────────────────────────

export async function getShoppingList(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    if (!email) throw new AppError(400, 'email is required');
    const userId = await resolveUserId(email);
    const items = await prisma.shoppingItem.findMany({ where: { userId } });
    success(res, items);
  } catch (err) { next(err); }
}

export async function addShoppingItem(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, item } = req.body;
    if (!email || !item) throw new AppError(400, 'email and item required');
    const userId = await resolveUserId(email);
    const created_item = await prisma.shoppingItem.create({
      data: {
        userId,
        ingredientName: item.ingredientName,
        amount: item.amount ?? 0,
        unit: item.unit ?? '',
        recipeId: item.recipeId ?? '',
        recipeName: item.recipeName ?? '',
      },
    });
    created(res, created_item);
  } catch (err) { next(err); }
}

export async function isAddedInShoppingList(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, recipeId } = req.body;
    if (!email || !recipeId) throw new AppError(400, 'email and recipeId required');
    const userId = await resolveUserId(email);
    const count = await prisma.shoppingItem.count({ where: { userId, recipeId } });
    success(res, { isAdded: count > 0 });
  } catch (err) { next(err); }
}

export async function deleteShoppingRecipe(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, recipeId } = req.body;
    if (!email || !recipeId) throw new AppError(400, 'email and recipeId required');
    const userId = await resolveUserId(email);
    await prisma.shoppingItem.deleteMany({ where: { userId, recipeId } });
    success(res, { message: 'Shopping items for recipe deleted' });
  } catch (err) { next(err); }
}

export async function updateShoppingItem(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, item } = req.body;
    if (!email || !item?.id) throw new AppError(400, 'email and item.id required');
    await prisma.shoppingItem.update({
      where: { id: item.id },
      data: { checked: item.checked, ingredientName: item.ingredientName, amount: item.amount, unit: item.unit },
    });
    success(res, { message: 'Item updated' });
  } catch (err) { next(err); }
}

export async function clearMarkedItems(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    if (!email) throw new AppError(400, 'email is required');
    const userId = await resolveUserId(email);
    await prisma.shoppingItem.deleteMany({ where: { userId, checked: true } });
    success(res, { message: 'Marked items cleared' });
  } catch (err) { next(err); }
}

export async function clearEntireShoppingList(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    if (!email) throw new AppError(400, 'email is required');
    const userId = await resolveUserId(email);
    await prisma.shoppingItem.deleteMany({ where: { userId } });
    success(res, { message: 'Shopping list cleared' });
  } catch (err) { next(err); }
}
