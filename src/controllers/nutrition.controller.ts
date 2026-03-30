import type { Request, Response, NextFunction } from 'express';
import { lookupFood } from '../services/ai/edamam';
import { success, fail } from '../utils/response';

export async function searchNutrition(req: Request, res: Response, next: NextFunction) {
  try {
    const query = req.query.q as string;
    if (!query || query.length < 2) {
      return fail(res, 'Query parameter "q" must be at least 2 characters', 400);
    }

    const results = await lookupFood(query);
    success(res, results);
  } catch (err) {
    next(err);
  }
}
