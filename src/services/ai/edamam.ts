import axios from 'axios';
import { env } from '../../config/env';
import type { NutritionLookup, EdamamResponse, EdamamHint } from '../../types';

const EDAMAM_PARSER = 'https://api.edamam.com/api/food-database/v2/parser';
const EDAMAM_NUTRIENTS = 'https://api.edamam.com/api/food-database/v2/nutrients';

export async function lookupFood(query: string): Promise<NutritionLookup[]> {
  if (!env.edamam.appId || !env.edamam.appKey) {
    return [];
  }

  const response = await axios.get<EdamamResponse>(EDAMAM_PARSER, {
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
    const nutrients = food.nutrients;

    results.push({
      foodId: food.foodId,
      label: food.label,
      nutrients: {
        calories: nutrients.ENERC_KCAL ?? 0,
        protein: nutrients.PROCNT ?? 0,
        fat: nutrients.FAT ?? 0,
        carbs: nutrients.CHOCDF ?? 0,
        fiber: nutrients.FIBTG,
        sugar: nutrients.SUGAR,
        sodium: nutrients.NA,
        gi: estimateGI(food.label, nutrients),
      },
      measures: hint.measures?.map((m) => ({
        uri: m.uri,
        label: m.label,
        weight: m.weight,
      })) ?? [],
    });
  }

  return results;
}

/**
 * Estimate glycemic index from macro composition when Edamam doesn't provide it directly.
 * Uses the carb-to-fiber ratio as a proxy: high fiber relative to carbs = lower GI.
 */
function estimateGI(
  label: string,
  nutrients: Record<string, number>,
): number {
  const carbs = nutrients.CHOCDF ?? 0;
  const fiber = nutrients.FIBTG ?? 0;
  const sugar = nutrients.SUGAR ?? 0;
  const protein = nutrients.PROCNT ?? 0;
  const fat = nutrients.FAT ?? 0;

  if (carbs < 5) return 20;

  const fiberRatio = fiber / Math.max(carbs, 1);
  const sugarRatio = sugar / Math.max(carbs, 1);
  const proteinFatDamper = (protein + fat) > 15 ? 0.85 : 1.0;

  let baseGI = 55;
  if (fiberRatio > 0.15) baseGI -= 15;
  else if (fiberRatio > 0.08) baseGI -= 8;

  if (sugarRatio > 0.6) baseGI += 15;
  else if (sugarRatio > 0.3) baseGI += 8;

  baseGI *= proteinFatDamper;

  return Math.round(Math.max(10, Math.min(100, baseGI)));
}

export function computeInsulinScore(gi: number, protein: number, carbs: number, fat: number): number {
  if (carbs < 5) return 2;

  const carbLoad = carbs * (gi / 100);
  const proteinDamper = protein > 20 ? 0.8 : protein > 10 ? 0.9 : 1.0;
  const fatDamper = fat > 10 ? 0.85 : 1.0;

  const rawScore = carbLoad * proteinDamper * fatDamper;

  if (rawScore < 10) return 2;
  if (rawScore < 20) return 4;
  if (rawScore < 35) return 6;
  if (rawScore < 50) return 8;
  return 10;
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
