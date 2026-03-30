import { openai } from '../../config/openai';
import type { FoodAnalysis, BodyAnalysis, ReceiptAnalysis } from '../../types';

export async function analyzeFoodImage(imageUrl: string): Promise<FoodAnalysis> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a nutrition analysis AI. Analyze the food in the image and return a JSON object with:
- foods: array of detected foods, each with { name, quantity (e.g. "1 cup"), calories, protein, carbs, fat, fiber, sugar, confidence (0-1) }
- totalCalories, totalProtein, totalCarbs, totalFat: sum of all foods
- confidence: overall confidence (0-1)
Be precise with portions. If unsure, provide your best estimate with lower confidence.
Return ONLY valid JSON, no markdown.`,
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Analyze the food in this image. Identify each food item and estimate its nutritional content.' },
          { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } },
        ],
      },
    ],
    response_format: { type: 'json_object' },
    max_tokens: 1500,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from vision model');

  return JSON.parse(content) as FoodAnalysis;
}

export async function analyzeReceiptImage(imageUrl: string): Promise<ReceiptAnalysis> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a receipt OCR AI. Extract data from the receipt image and return a JSON object with:
- storeName: string or null
- date: string (ISO format) or null
- items: array of { name, quantity, price, category (one of: produce, dairy, meat, bakery, beverage, snack, frozen, other) }
- total: number or null
- currency: string (e.g. "USD") or null
Return ONLY valid JSON, no markdown.`,
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Extract all line items and totals from this receipt.' },
          { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } },
        ],
      },
    ],
    response_format: { type: 'json_object' },
    max_tokens: 2000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from vision model');

  return JSON.parse(content) as ReceiptAnalysis;
}

export async function analyzeBodyImage(imageUrl: string): Promise<BodyAnalysis> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a fitness assessment AI. Analyze the body photo and return a JSON object with:
- estimatedBodyFatPercentage: number or null (rough estimate based on visible indicators)
- bodyFatRange: string (e.g. "15-20%")
- muscleAssessment: string (brief description of visible muscle development)
- posture: string (brief posture assessment)
- recommendations: array of strings (2-4 actionable fitness suggestions)
- disclaimer: "This is an AI-generated estimate for informational purposes only. Consult a healthcare professional for accurate body composition analysis."
Be conservative and honest about uncertainty. Return ONLY valid JSON, no markdown.`,
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Provide a general fitness assessment based on this photo.' },
          { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } },
        ],
      },
    ],
    response_format: { type: 'json_object' },
    max_tokens: 1000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from vision model');

  return JSON.parse(content) as BodyAnalysis;
}
