import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as mealplanApi from '../api/mealplan';
import { useAuthStore } from '../store/useAuthStore';
import { useMealPlanStore } from '../store/useMealPlanStore';
import type { MealPlan, ShoppingListItem, MealPlanGenerateRequest } from '../api/types';

export function useMealPlan() {
  const email = useAuthStore((s) => s.user?.email);
  const setCurrentPlan = useMealPlanStore((s) => s.setCurrentPlan);

  return useQuery({
    queryKey: ['mealPlan', email],
    queryFn: async () => {
      const plan = await mealplanApi.getMealPlan(email!);
      setCurrentPlan(plan);
      return plan;
    },
    enabled: !!email,
  });
}

export function useSaveMealPlan() {
  const queryClient = useQueryClient();
  const email = useAuthStore((s) => s.user?.email);

  return useMutation({
    mutationFn: (plan: MealPlan) =>
      mealplanApi.setMealPlan({ email: email!, mealPlan: plan }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlan', email] });
    },
  });
}

export function useRecipes() {
  const email = useAuthStore((s) => s.user?.email);
  const setRecipes = useMealPlanStore((s) => s.setRecipes);

  return useQuery({
    queryKey: ['recipes', email],
    queryFn: async () => {
      const recipes = await mealplanApi.getRecipes(email!);
      setRecipes(recipes);
      return recipes;
    },
    enabled: !!email,
  });
}

export function useShoppingList() {
  const email = useAuthStore((s) => s.user?.email);
  const setShoppingList = useMealPlanStore((s) => s.setShoppingList);

  return useQuery({
    queryKey: ['shoppingList', email],
    queryFn: async () => {
      const items = await mealplanApi.getShoppingList(email!);
      setShoppingList(items);
      return items;
    },
    enabled: !!email,
  });
}

export function useToggleShoppingItem() {
  const queryClient = useQueryClient();
  const email = useAuthStore((s) => s.user?.email);
  const toggleItem = useMealPlanStore((s) => s.toggleShoppingItem);

  return useMutation({
    mutationFn: async (item: ShoppingListItem) => {
      toggleItem(item.id);
      await mealplanApi.updateShoppingItem({
        email: email!,
        item: { ...item, checked: !item.checked },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shoppingList', email] });
    },
  });
}

export function useClearShoppingList() {
  const queryClient = useQueryClient();
  const email = useAuthStore((s) => s.user?.email);

  return useMutation({
    mutationFn: () => mealplanApi.clearEntireShoppingList(email!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shoppingList', email] });
    },
  });
}

export function useGenerateAIMealPlan() {
  return useMutation({
    mutationFn: (request: MealPlanGenerateRequest) =>
      mealplanApi.generateAIMealPlan(request),
  });
}
