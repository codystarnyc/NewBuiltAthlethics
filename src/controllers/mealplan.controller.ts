import type { Request, Response, NextFunction } from 'express';
import { generateMealPlan } from '../services/ai/mealplan';
import { success, fail } from '../utils/response';
import type { MealPlanRequest } from '../types';

export async function createMealPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as Partial<MealPlanRequest>;

    if (!body.calorieTarget || body.calorieTarget < 800 || body.calorieTarget > 10000) {
      return fail(res, 'calorieTarget is required and must be between 800-10000', 400);
    }

    const request: MealPlanRequest = {
      userId: req.user?.userId ?? 'anonymous',
      calorieTarget: body.calorieTarget,
      proteinTarget: body.proteinTarget,
      carbsTarget: body.carbsTarget,
      fatTarget: body.fatTarget,
      diet: body.diet,
      allergies: body.allergies,
      excludedIngredients: body.excludedIngredients,
      ingredients: body.ingredients,
      daysCount: Math.min(body.daysCount ?? 7, 14),
      mealsPerDay: Math.min(body.mealsPerDay ?? 3, 5),
    };

    const plan = await generateMealPlan(request);
    success(res, plan, { message: 'Meal plan generated successfully' });
  } catch (err) {
    next(err);
  }
}
