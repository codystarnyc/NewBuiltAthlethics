import { apiClient, imageApiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { Food, FoodDiaryEntry, NutritionSearchResult } from './types';

interface ApiEnvelope<T> {
  status: boolean;
  data: T;
}

export async function searchNutritionAI(query: string): Promise<NutritionSearchResult[]> {
  const res = await imageApiClient.get<ApiEnvelope<NutritionSearchResult[]>>(
    ENDPOINTS.imageUpload.nutritionSearch,
    { params: { q: query } },
  );
  return res.data.data;
}

export async function getAllFoods(): Promise<Food[]> {
  const res = await apiClient.get<Food[]>(ENDPOINTS.food.getAll);
  return res.data;
}

export async function addFood(data: Omit<Food, 'id'>): Promise<Food> {
  const res = await apiClient.post<Food>(ENDPOINTS.food.add, data);
  return res.data;
}

export async function updateFood(data: Food): Promise<Food> {
  const res = await apiClient.put<Food>(ENDPOINTS.food.update, data);
  return res.data;
}

export async function getFoodByBarcode(barcode: string): Promise<Food> {
  const res = await apiClient.get<Food>(ENDPOINTS.food.getByBarcode, { params: { barcode } });
  return res.data;
}

export async function searchFoodByText(searchText: string): Promise<Food[]> {
  const res = await apiClient.get<Food[]>(ENDPOINTS.food.searchByText, { params: { searchText } });
  return res.data;
}

export async function getFoodDiary(email: string, date: string): Promise<FoodDiaryEntry[]> {
  const res = await apiClient.get<FoodDiaryEntry[]>(ENDPOINTS.foodDiary.get, { params: { email, date } });
  return res.data;
}

export async function setFoodDiary(data: {
  email: string;
  foodDiary: FoodDiaryEntry[];
}): Promise<void> {
  await apiClient.put(ENDPOINTS.foodDiary.set, data);
}

export async function deleteFoodDiaryEntry(data: {
  email: string;
  entryId: string;
  date: string;
}): Promise<void> {
  await apiClient.put(ENDPOINTS.foodDiary.delete, data);
}
