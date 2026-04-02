import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Workout, WorkoutSet } from '../api/types';

interface WorkoutState {
  currentWorkout: {
    exerciseId: string;
    exerciseName: string;
    sets: WorkoutSet[];
  } | null;
  todaysWorkouts: Workout[];
  selectedDate: string;

  startWorkout: (exerciseId: string, exerciseName: string) => void;
  addSet: (set: WorkoutSet) => void;
  removeSet: (index: number) => void;
  updateSet: (index: number, set: WorkoutSet) => void;
  finishWorkout: () => void;
  cancelWorkout: () => void;
  setTodaysWorkouts: (workouts: Workout[]) => void;
  setSelectedDate: (date: string) => void;
  clear: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set) => ({
      currentWorkout: null,
      todaysWorkouts: [],
      selectedDate: new Date().toISOString().split('T')[0],

      startWorkout: (exerciseId, exerciseName) =>
        set({ currentWorkout: { exerciseId, exerciseName, sets: [] } }),

      addSet: (newSet) =>
        set((state) => ({
          currentWorkout: state.currentWorkout
            ? { ...state.currentWorkout, sets: [...state.currentWorkout.sets, newSet] }
            : null,
        })),

      removeSet: (index) =>
        set((state) => ({
          currentWorkout: state.currentWorkout
            ? {
                ...state.currentWorkout,
                sets: state.currentWorkout.sets.filter((_, i) => i !== index),
              }
            : null,
        })),

      updateSet: (index, updatedSet) =>
        set((state) => ({
          currentWorkout: state.currentWorkout
            ? {
                ...state.currentWorkout,
                sets: state.currentWorkout.sets.map((s, i) => (i === index ? updatedSet : s)),
              }
            : null,
        })),

      finishWorkout: () => set({ currentWorkout: null }),
      cancelWorkout: () => set({ currentWorkout: null }),

      setTodaysWorkouts: (workouts) => set({ todaysWorkouts: workouts }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      clear: () => set({ currentWorkout: null, todaysWorkouts: [], selectedDate: new Date().toISOString().split('T')[0] }),
    }),
    {
      name: 'workout-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedDate: state.selectedDate,
      }),
    },
  ),
);
