import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../api/types';

interface UserState {
  profile: User | null;
  preferences: {
    calorieTarget?: number;
    diet?: string;
    allergies?: string[];
    units?: 'metric' | 'imperial';
  };

  setProfile: (profile: User) => void;
  updateProfile: (updates: Partial<User>) => void;
  setPreferences: (prefs: Partial<UserState['preferences']>) => void;
  clear: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      preferences: {},

      setProfile: (profile) => set({ profile }),

      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        })),

      setPreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),

      clear: () => set({ profile: null, preferences: {} }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
