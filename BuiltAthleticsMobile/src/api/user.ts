import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { User, UserHealthInfo } from './types';

export async function getUser(email: string): Promise<User> {
  const res = await apiClient.get<User>(ENDPOINTS.user.get, { params: { email } });
  return res.data;
}

export async function getUserDetails(email: string): Promise<User> {
  const res = await apiClient.get<User>(ENDPOINTS.user.getDetails, { params: { email } });
  return res.data;
}

export async function getUserHome(email: string): Promise<User> {
  const res = await apiClient.get<User>(ENDPOINTS.user.getHome, { params: { email } });
  return res.data;
}

export async function getUserHealthInfo(email: string, date: string): Promise<UserHealthInfo> {
  const res = await apiClient.get<UserHealthInfo>(ENDPOINTS.user.getHealthInfo, {
    params: { email, date },
  });
  return res.data;
}

export async function getCalendarDates(email: string): Promise<string[]> {
  const res = await apiClient.get<string[]>(ENDPOINTS.user.getCalendarDates, {
    params: { email },
  });
  return res.data;
}

export async function setName(data: { email: string; name: string }): Promise<void> {
  await apiClient.put(ENDPOINTS.user.setName, data);
}

export async function setGender(data: { email: string; gender: string }): Promise<void> {
  await apiClient.put(ENDPOINTS.user.setGender, data);
}

export async function setWeight(data: { email: string; weight: number }): Promise<void> {
  await apiClient.put(ENDPOINTS.user.setWeight, data);
}

export async function setHeight(data: { email: string; height: number }): Promise<void> {
  await apiClient.put(ENDPOINTS.user.setHeight, data);
}

export async function setDateOfBirth(data: { email: string; dateOfBirth: string }): Promise<void> {
  await apiClient.put(ENDPOINTS.user.setDateOfBirth, data);
}

export async function setGym(data: { email: string; gym: string }): Promise<void> {
  await apiClient.put(ENDPOINTS.user.setGym, data);
}

export async function setFitnessGoal(data: { email: string; fitnessGoal: string }): Promise<void> {
  await apiClient.put(ENDPOINTS.user.setFitnessGoal, data);
}

export async function setGymFrequency(data: { email: string; gymFrequency: string }): Promise<void> {
  await apiClient.put(ENDPOINTS.user.setGymFrequency, data);
}

export async function setGymDays(data: { email: string; gymDays: string[] }): Promise<void> {
  await apiClient.put(ENDPOINTS.user.setGymDays, data);
}

export async function setAutoTracking(data: { email: string; autoTracking: boolean }): Promise<void> {
  await apiClient.put(ENDPOINTS.user.setAutoTracking, data);
}

export async function setWorkoutConfig(data: { email: string; config: Record<string, unknown> }): Promise<void> {
  await apiClient.put(ENDPOINTS.user.setWorkoutConfig, data);
}

export async function setPassword(data: { email: string; password: string; newPassword: string }): Promise<void> {
  await apiClient.post(ENDPOINTS.user.setPassword, data);
}

export async function addStepsDay(data: { email: string; date: string; steps: number }): Promise<void> {
  await apiClient.put(ENDPOINTS.user.addStepsDay, data);
}

export async function addPulseDay(data: { email: string; date: string; pulse: number }): Promise<void> {
  await apiClient.put(ENDPOINTS.user.addPulseDay, data);
}
