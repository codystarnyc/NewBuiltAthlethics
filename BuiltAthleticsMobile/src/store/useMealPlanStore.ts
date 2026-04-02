import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MealPlan, MealPlanPreferences, Recipe, ShoppingListItem } from '../api/types';

interface MealPlanState {
  currentPlan: MealPlan | null;
  recipes: Recipe[];
  shoppingList: ShoppingListItem[];
  preferences: MealPlanPreferences;

  setCurrentPlan: (plan: MealPlan | null) => void;
  setRecipes: (recipes: Recipe[]) => void;
  setShoppingList: (items: ShoppingListItem[]) => void;
  toggleShoppingItem: (id: string) => void;
  setPreferences: (prefs: Partial<MealPlanPreferences>) => void;
  clear: () => void;
}

export const useMealPlanStore = create<MealPlanState>()(
  persist(
    (set, get) => ({
      currentPlan: null,
      recipes: [],
      shoppingList: [],
      preferences: {},

      setCurrentPlan: (plan) => set({ currentPlan: plan }),
      setRecipes: (recipes) => set({ recipes }),
      setShoppingList: (items) => set({ shoppingList: items }),

      toggleShoppingItem: (id) =>
        set({
          shoppingList: get().shoppingList.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item,
          ),
        }),

      setPreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),

      clear: () =>
        set({ currentPlan: null, recipes: [], shoppingList: [], preferences: {} }),
    }),
    {
      name: 'mealplan-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ preferences: state.preferences }),
    },
  ),
);
