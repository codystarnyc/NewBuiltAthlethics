import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as foodApi from '../api/food';
import { useAuthStore } from '../store/useAuthStore';
import { useFoodStore } from '../store/useFoodStore';
import type { Food, FoodDiaryEntry, NutritionSearchResult } from '../api/types';

export function useFoodSearch(searchText: string) {
  return useQuery({
    queryKey: ['foodSearch', searchText],
    queryFn: () => foodApi.searchFoodByText(searchText),
    enabled: searchText.length >= 2,
    staleTime: 30 * 1000,
  });
}

export function useFoodByBarcode(barcode: string) {
  return useQuery({
    queryKey: ['foodBarcode', barcode],
    queryFn: () => foodApi.getFoodByBarcode(barcode),
    enabled: !!barcode,
  });
}

export function useAddFoodDiaryEntry() {
  const email = useAuthStore((s) => s.user?.email);
  const addEntry = useFoodStore((s) => s.addEntry);

  return useMutation({
    mutationFn: async (entry: FoodDiaryEntry) => {
      addEntry(entry);
      const entries = useFoodStore.getState().diaryEntries;
      await foodApi.setFoodDiary({ email: email!, foodDiary: entries });
    },
  });
}

export function useRemoveFoodDiaryEntry() {
  const email = useAuthStore((s) => s.user?.email);
  const selectedDate = useFoodStore((s) => s.selectedDate);
  const removeEntry = useFoodStore((s) => s.removeEntry);

  return useMutation({
    mutationFn: async (entryId: string) => {
      removeEntry(entryId);
      await foodApi.deleteFoodDiaryEntry({ email: email!, entryId, date: selectedDate });
    },
  });
}

export function useCreateFood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Food, 'id'>) => foodApi.addFood(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodSearch'] });
    },
  });
}

export function useNutritionSearch(query: string) {
  return useQuery<NutritionSearchResult[]>({
    queryKey: ['nutritionSearch', query],
    queryFn: () => foodApi.searchNutritionAI(query),
    enabled: query.length >= 2,
    staleTime: 60 * 1000,
  });
}
