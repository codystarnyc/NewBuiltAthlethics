import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as exerciseApi from '../api/exercise';
import { useAuthStore } from '../store/useAuthStore';
import { useWorkoutStore } from '../store/useWorkoutStore';
import type { WorkoutSet } from '../api/types';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: exerciseApi.getCategoriesForApp,
    staleTime: 5 * 60 * 1000,
  });
}

export function useExercises() {
  return useQuery({
    queryKey: ['exercises'],
    queryFn: exerciseApi.getAllExercisesForApp,
    staleTime: 5 * 60 * 1000,
  });
}

export function useExercisesByCategory(categoryId: string) {
  return useQuery({
    queryKey: ['exercises', categoryId],
    queryFn: () => exerciseApi.getExercisesByCategory(categoryId),
    enabled: !!categoryId,
  });
}

export function useTodaysWorkouts() {
  const email = useAuthStore((s) => s.user?.email);
  const date = useWorkoutStore((s) => s.selectedDate);

  return useQuery({
    queryKey: ['workouts', email, date],
    queryFn: () => exerciseApi.getWorkout({ email: email!, date }),
    enabled: !!email,
  });
}

export function useAddWorkout() {
  const queryClient = useQueryClient();
  const email = useAuthStore((s) => s.user?.email);
  const date = useWorkoutStore((s) => s.selectedDate);

  return useMutation({
    mutationFn: (data: { exerciseId: string; exerciseName: string; sets: WorkoutSet[] }) =>
      exerciseApi.addWorkout({ ...data, email: email!, date }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts', email, date] });
    },
  });
}

export function useDeleteWorkout() {
  const queryClient = useQueryClient();
  const email = useAuthStore((s) => s.user?.email);
  const date = useWorkoutStore((s) => s.selectedDate);

  return useMutation({
    mutationFn: (id: string) => exerciseApi.deleteWorkout({ id, email: email! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts', email, date] });
    },
  });
}

export function useCustomExercises() {
  const email = useAuthStore((s) => s.user?.email);

  return useQuery({
    queryKey: ['customExercises', email],
    queryFn: () => exerciseApi.getCustomExercises(email!),
    enabled: !!email,
  });
}

export function useAddCustomExercise() {
  const queryClient = useQueryClient();
  const email = useAuthStore((s) => s.user?.email);

  return useMutation({
    mutationFn: (data: { name: string; categoryId?: string; notes?: string }) =>
      exerciseApi.addCustomExercise({ email: email!, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customExercises', email] });
    },
  });
}
