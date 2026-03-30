import type { ImageType, ProcessingResult } from '../../types';
import { analyzeFoodImage, analyzeReceiptImage, analyzeBodyImage } from '../ai/vision';
import { enrichFoodAnalysis } from '../ai/edamam';
import type { FoodAnalysis } from '../../types';

const processingStore = new Map<string, ProcessingResult>();

export function getResult(id: string): ProcessingResult | undefined {
  return processingStore.get(id);
}

export function getAllResults(): ProcessingResult[] {
  return Array.from(processingStore.values());
}

export async function enqueueProcessing(
  uploadId: string,
  imageUrl: string,
  type: ImageType,
): Promise<string> {
  const result: ProcessingResult = {
    id: uploadId,
    uploadId,
    type,
    status: 'processing',
    result: null,
    createdAt: new Date(),
  };

  processingStore.set(uploadId, result);

  processImage(uploadId, imageUrl, type).catch((err) => {
    const stored = processingStore.get(uploadId);
    if (stored) {
      stored.status = 'failed';
      stored.error = err instanceof Error ? err.message : 'Unknown error';
      stored.completedAt = new Date();
    }
  });

  return uploadId;
}

async function processImage(id: string, imageUrl: string, type: ImageType): Promise<void> {
  const startTime = Date.now();
  const stored = processingStore.get(id);
  if (!stored) return;

  try {
    let result;

    switch (type) {
      case 'food': {
        const analysis = await analyzeFoodImage(imageUrl);
        const foodNames = analysis.foods.map((f) => f.name);
        const edamamData = await enrichFoodAnalysis(foodNames);

        for (const food of analysis.foods) {
          const enrichment = edamamData.get(food.name);
          if (enrichment) {
            food.calories = food.calories || enrichment.nutrients.calories;
            food.protein = food.protein || enrichment.nutrients.protein;
            food.carbs = food.carbs || enrichment.nutrients.carbs;
            food.fat = food.fat || enrichment.nutrients.fat;
          }
        }

        const totals = analysis.foods.reduce(
          (acc, f) => ({
            calories: acc.calories + f.calories,
            protein: acc.protein + f.protein,
            carbs: acc.carbs + f.carbs,
            fat: acc.fat + f.fat,
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 },
        );
        analysis.totalCalories = totals.calories;
        analysis.totalProtein = totals.protein;
        analysis.totalCarbs = totals.carbs;
        analysis.totalFat = totals.fat;

        result = analysis;
        break;
      }
      case 'receipt':
        result = await analyzeReceiptImage(imageUrl);
        break;
      case 'body':
        result = await analyzeBodyImage(imageUrl);
        break;
    }

    stored.status = 'completed';
    stored.result = result;
    stored.processingTimeMs = Date.now() - startTime;
    stored.completedAt = new Date();
  } catch (err) {
    stored.status = 'failed';
    stored.error = err instanceof Error ? err.message : 'Processing failed';
    stored.processingTimeMs = Date.now() - startTime;
    stored.completedAt = new Date();
  }
}
