import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { Category, CustomExercise, Exercise, Workout, WorkoutSet } from './types';

export async function getAllExercisesForApp(): Promise<Exercise[]> {
  const res = await apiClient.get<Exercise[]>(ENDPOINTS.exercise.getAllForApp);
  return res.data;
}

export async function getExercisesByCategory(categoryId: string): Promise<Exercise[]> {
  const res = await apiClient.post<Exercise[]>(ENDPOINTS.exercise.getByCategory, { categoryId });
  return res.data;
}

export async function getCategoriesForApp(): Promise<Category[]> {
  const res = await apiClient.get<Category[]>(ENDPOINTS.category.getForApp);
  return res.data;
}

export async function setViewVideo(data: { exerciseId: string; categoryId: string }): Promise<void> {
  await apiClient.post(ENDPOINTS.exercise.setViewVideo, data);
}

export async function getInsights(): Promise<Record<string, unknown>> {
  const res = await apiClient.get(ENDPOINTS.exercise.getInsights);
  return res.data;
}

// --- BA Workout CRUD ---

export async function addWorkout(data: {
  email: string;
  exerciseId: string;
  exerciseName: string;
  date: string;
  sets: WorkoutSet[];
}): Promise<Workout> {
  const res = await apiClient.post<Workout>(ENDPOINTS.ba.addWorkout, data);
  return res.data;
}

export async function getWorkout(data: { email: string; date: string }): Promise<Workout[]> {
  const res = await apiClient.post<Workout[]>(ENDPOINTS.ba.getWorkout, data);
  return res.data;
}

export async function getWorkoutByExerciseId(data: {
  email: string;
  exerciseId: string;
}): Promise<Workout[]> {
  const res = await apiClient.post<Workout[]>(ENDPOINTS.ba.getWorkoutByExerciseId, data);
  return res.data;
}

export async function updateWorkout(data: Workout): Promise<Workout> {
  const res = await apiClient.post<Workout>(ENDPOINTS.ba.updateWorkout, data);
  return res.data;
}

export async function deleteWorkout(data: { id: string; email: string }): Promise<void> {
  await apiClient.post(ENDPOINTS.ba.deleteWorkout, data);
}

// --- Custom Exercises ---

export async function addCustomExercise(data: Omit<CustomExercise, 'id'>): Promise<CustomExercise> {
  const res = await apiClient.post<CustomExercise>(ENDPOINTS.ba.addCustomExercise, data);
  return res.data;
}

export async function getCustomExercises(email: string): Promise<CustomExercise[]> {
  const res = await apiClient.post<CustomExercise[]>(ENDPOINTS.ba.getCustomExercise, { email });
  return res.data;
}

export async function deleteCustomExercise(data: { id: string; email: string }): Promise<void> {
  await apiClient.post(ENDPOINTS.ba.deleteExercise, data);
}

export async function updateCustomExercise(data: CustomExercise): Promise<CustomExercise> {
  const res = await apiClient.post<CustomExercise>(ENDPOINTS.ba.updateCustomExercise, data);
  return res.data;
}
