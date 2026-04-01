import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';
import { env } from './env';

let _client: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!_client) {
    if (!env.gemini.apiKey) throw new Error('GEMINI_API_KEY is not set');
    _client = new GoogleGenerativeAI(env.gemini.apiKey);
  }
  return _client;
}

export function getVisionModel(): GenerativeModel {
  return getGeminiClient().getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: { responseMimeType: 'application/json' },
  });
}

export function getTextModel(): GenerativeModel {
  return getGeminiClient().getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: { responseMimeType: 'application/json' },
  });
}
