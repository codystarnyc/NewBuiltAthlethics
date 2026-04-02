import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FoodDiaryEntry } from '../api/types';

interface FoodState {
  selectedDate: string;
  diaryEntries: FoodDiaryEntry[];
  dailyTotals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };

  setSelectedDate: (date: string) => void;
  setDiaryEntries: (entries: FoodDiaryEntry[]) => void;
  addEntry: (entry: FoodDiaryEntry) => void;
  removeEntry: (id: string) => void;
  recalculateTotals: () => void;
  clear: () => void;
}

function computeTotals(entries: FoodDiaryEntry[]) {
  return entries.reduce(
    (acc, e) => ({
      calories: acc.calories + (e.calories ?? 0),
      protein: acc.protein + (e.protein ?? 0),
      carbs: acc.carbs + (e.carbs ?? 0),
      fat: acc.fat + (e.fat ?? 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

export const useFoodStore = create<FoodState>()(
  persist(
    (set, get) => ({
      selectedDate: new Date().toISOString().split('T')[0],
      diaryEntries: [],
      dailyTotals: { calories: 0, protein: 0, carbs: 0, fat: 0 },

      setSelectedDate: (date) => set({ selectedDate: date }),

      setDiaryEntries: (entries) =>
        set({ diaryEntries: entries, dailyTotals: computeTotals(entries) }),

      addEntry: (entry) => {
        const entries = [...get().diaryEntries, entry];
        set({ diaryEntries: entries, dailyTotals: computeTotals(entries) });
      },

      removeEntry: (id) => {
        const entries = get().diaryEntries.filter((e) => e.id !== id);
        set({ diaryEntries: entries, dailyTotals: computeTotals(entries) });
      },

      recalculateTotals: () => {
        set({ dailyTotals: computeTotals(get().diaryEntries) });
      },

      clear: () =>
        set({
          diaryEntries: [],
          dailyTotals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
          selectedDate: new Date().toISOString().split('T')[0],
        }),
    }),
    {
      name: 'food-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ selectedDate: state.selectedDate }),
    },
  ),
);
