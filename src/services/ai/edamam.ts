import axios from 'axios';
import { env } from '../../config/env';
import type { NutritionLookup, EdamamResponse } from '../../types';

const EDAMAM_BASE = 'https://api.edamam.com/api/food-database/v2';

export async function lookupFood(query: string): Promise<NutritionLookup[]> {
  if (!env.edamam.appId || !env.edamam.appKey) {
    return [];
  }

  const response = await axios.get<EdamamResponse>(`${EDAMAM_BASE}/parser`, {
    params: {
      app_id: env.edamam.appId,
      app_key: env.edamam.appKey,
      ingr: query,
      'nutrition-type': 'cooking',
    },
  });

  const results: NutritionLookup[] = [];

  for (const hint of response.data.hints.slice(0, 5)) {
    const { food } = hint;
    results.push({
      foodId: food.foodId,
      label: food.label,
      nutrients: {
        calories: food.nutrients.ENERC_KCAL ?? 0,
        protein: food.nutrients.PROCNT ?? 0,
        fat: food.nutrients.FAT ?? 0,
        carbs: food.nutrients.CHOCDF ?? 0,
        fiber: food.nutrients.FIBTG,
      },
      measures: [],
    });
  }

  return results;
}

export async function enrichFoodAnalysis(
  foodNames: string[],
): Promise<Map<string, NutritionLookup>> {
  const enriched = new Map<string, NutritionLookup>();

  const lookups = await Promise.allSettled(
    foodNames.map((name) => lookupFood(name)),
  );

  for (let i = 0; i < foodNames.length; i++) {
    const result = lookups[i];
    if (result.status === 'fulfilled' && result.value.length > 0) {
      enriched.set(foodNames[i], result.value[0]);
    }
  }

  return enriched;
}
