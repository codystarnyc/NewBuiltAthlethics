import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { HealthData } from './types';

export async function setHealthData(data: HealthData): Promise<void> {
  await apiClient.post(ENDPOINTS.health.setData, data);
}

export async function getHealthData(data: {
  email: string;
  date: string;
}): Promise<HealthData> {
  const res = await apiClient.post<HealthData>(ENDPOINTS.health.getData, data);
  return res.data;
}
