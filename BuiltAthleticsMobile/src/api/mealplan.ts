import { apiClient, imageApiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { Ingredient, MealPlan, Recipe, ShoppingListItem, MealPlanGenerateRequest, GeneratedMealPlan } from './types';

interface ApiEnvelope<T> {
  status: boolean;
  data: T;
}

export async function generateAIMealPlan(
  request: MealPlanGenerateRequest,
): Promise<GeneratedMealPlan> {
  const res = await imageApiClient.post<ApiEnvelope<GeneratedMealPlan>>(
    ENDPOINTS.imageUpload.generateMealPlan,
    request,
  );
  return res.data.data;
}

export async function setMealPlan(data: {
  email: string;
  mealPlan: MealPlan;
}): Promise<void> {
  await apiClient.post(ENDPOINTS.ba.setMealPlan, data);
}

export async function getMealPlan(email: string): Promise<MealPlan> {
  const res = await apiClient.post<MealPlan>(ENDPOINTS.ba.getMealPlan, { email });
  return res.data;
}

export async function setIngredients(data: {
  email: string;
  ingredients: Ingredient[];
}): Promise<void> {
  await apiClient.post(ENDPOINTS.ba.setIngredients, data);
}

export async function getIngredients(email: string): Promise<Ingredient[]> {
  const res = await apiClient.post<Ingredient[]>(ENDPOINTS.ba.getIngredients, { email });
  return res.data;
}

export async function getRecipes(email: string): Promise<Recipe[]> {
  const res = await apiClient.post<Recipe[]>(ENDPOINTS.ba.getRecipes, { email });
  return res.data;
}

// --- Shopping List ---

export async function getShoppingList(email: string): Promise<ShoppingListItem[]> {
  const res = await apiClient.post<ShoppingListItem[]>(ENDPOINTS.ba.getShoppingIng, { email });
  return res.data;
}

export async function addShoppingItem(data: {
  email: string;
  item: Omit<ShoppingListItem, 'id'>;
}): Promise<void> {
  await apiClient.post(ENDPOINTS.ba.addShoppingIng, data);
}

export async function isAddedInShoppingList(data: {
  email: string;
  recipeId: string;
}): Promise<boolean> {
  const res = await apiClient.post<{ isAdded: boolean }>(ENDPOINTS.ba.isAddedInShoppingList, data);
  return res.data.isAdded;
}

export async function deleteShoppingRecipe(data: {
  email: string;
  recipeId: string;
}): Promise<void> {
  await apiClient.post(ENDPOINTS.ba.deleteShoppingRecipe, data);
}

export async function updateShoppingItem(data: {
  email: string;
  item: ShoppingListItem;
}): Promise<void> {
  await apiClient.post(ENDPOINTS.ba.updateShoppingIng, data);
}

export async function clearMarkedItems(email: string): Promise<void> {
  await apiClient.post(ENDPOINTS.ba.clearMarkedItem, { email });
}

export async function clearEntireShoppingList(email: string): Promise<void> {
  await apiClient.post(ENDPOINTS.ba.clearEntireShoppingList, { email });
}
