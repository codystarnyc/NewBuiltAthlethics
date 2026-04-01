import { env } from '../../config/env';
import { getVisionModel } from '../../config/gemini';
import { getOpenAI } from '../../config/openai';
import { fetchImageAsBase64 } from '../../utils/image';
import type { FoodAnalysis, BodyAnalysis, ReceiptAnalysis } from '../../types';

const FOOD_PROMPT = `You are a nutrition analysis AI. Analyze the food in the image and return a JSON object with:
- foods: array of detected foods, each with { name, quantity (e.g. "1 cup"), calories, protein, carbs, fat, fiber, sugar, confidence (0-1) }
- totalCalories, totalProtein, totalCarbs, totalFat: sum of all foods
- confidence: overall confidence (0-1)
Be precise with portions. If unsure, provide your best estimate with lower confidence.
Return ONLY valid JSON, no markdown.`;

const RECEIPT_PROMPT = `You are a receipt OCR AI. Extract data from the receipt image and return a JSON object with:
- storeName: string or null
- date: string (ISO format) or null
- items: array of { name, quantity, price, category (one of: produce, dairy, meat, bakery, beverage, snack, frozen, other) }
- total: number or null
- currency: string (e.g. "USD") or null
Return ONLY valid JSON, no markdown.`;

const BODY_PROMPT = `You are a fitness assessment AI. Analyze the body photo and return a JSON object with:
- estimatedBodyFatPercentage: number or null (rough estimate based on visible indicators)
- bodyFatRange: string (e.g. "15-20%")
- muscleAssessment: string (brief description of visible muscle development)
- posture: string (brief posture assessment)
- recommendations: array of strings (2-4 actionable fitness suggestions)
- disclaimer: "This is an AI-generated estimate for informational purposes only. Consult a healthcare professional for accurate body composition analysis."
Be conservative and honest about uncertainty. Return ONLY valid JSON, no markdown.`;

async function geminiVision<T>(systemPrompt: string, userText: string, imageUrl: string): Promise<T> {
  const model = getVisionModel();
  const { data, mimeType } = await fetchImageAsBase64(imageUrl);

  const result = await model.generateContent([
    systemPrompt + '\n\n' + userText,
    { inlineData: { data, mimeType } },
  ]);

  const text = result.response.text();
  if (!text) throw new Error('No response from Gemini vision model');
  return JSON.parse(text) as T;
}

async function openaiVision<T>(systemPrompt: string, userText: string, imageUrl: string, maxTokens: number): Promise<T> {
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: [
          { type: 'text', text: userText },
          { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } },
        ],
      },
    ],
    response_format: { type: 'json_object' },
    max_tokens: maxTokens,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from OpenAI vision model');
  return JSON.parse(content) as T;
}

function useGemini(): boolean {
  return env.visionProvider === 'gemini' && !!env.gemini.apiKey;
}

async function withFallback<T>(
  systemPrompt: string,
  userText: string,
  imageUrl: string,
  maxTokens: number,
): Promise<T> {
  if (useGemini()) {
    try {
      return await geminiVision<T>(systemPrompt, userText, imageUrl);
    } catch (err) {
      console.warn('Gemini vision failed, falling back to OpenAI:', (err as Error).message);
    }
  }
  return openaiVision<T>(systemPrompt, userText, imageUrl, maxTokens);
}

export async function analyzeFoodImage(imageUrl: string): Promise<FoodAnalysis> {
  return withFallback<FoodAnalysis>(
    FOOD_PROMPT,
    'Analyze the food in this image. Identify each food item and estimate its nutritional content.',
    imageUrl,
    1500,
  );
}

export async function analyzeReceiptImage(imageUrl: string): Promise<ReceiptAnalysis> {
  return withFallback<ReceiptAnalysis>(
    RECEIPT_PROMPT,
    'Extract all line items and totals from this receipt.',
    imageUrl,
    2000,
  );
}

export async function analyzeBodyImage(imageUrl: string): Promise<BodyAnalysis> {
  return withFallback<BodyAnalysis>(
    BODY_PROMPT,
    'Provide a general fitness assessment based on this photo.',
    imageUrl,
    1000,
  );
}
