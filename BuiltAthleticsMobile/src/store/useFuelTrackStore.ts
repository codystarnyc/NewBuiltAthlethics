import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FuelTrackDay } from '../api/types';

interface FuelTrackState {
  todayScore: FuelTrackDay | null;
  history: FuelTrackDay[];
  lastSyncDate: string | null;

  setTodayScore: (score: FuelTrackDay | null) => void;
  setHistory: (history: FuelTrackDay[]) => void;
  setLastSyncDate: (date: string) => void;
  clear: () => void;
}

export const useFuelTrackStore = create<FuelTrackState>()(
  persist(
    (set) => ({
      todayScore: null,
      history: [],
      lastSyncDate: null,

      setTodayScore: (score) => set({ todayScore: score }),
      setHistory: (history) => set({ history }),
      setLastSyncDate: (date) => set({ lastSyncDate: date }),
      clear: () => set({ todayScore: null, history: [], lastSyncDate: null }),
    }),
    {
      name: 'fueltrack-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ lastSyncDate: state.lastSyncDate }),
    },
  ),
);
