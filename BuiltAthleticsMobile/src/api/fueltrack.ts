import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { FuelTrackDay, FuelTrackBreakdown, WalkLogEntry } from './types';

export async function getTodayScore(email: string, date?: string): Promise<FuelTrackDay> {
  const params: Record<string, string> = { email };
  if (date) params.date = date;
  const res = await apiClient.get<FuelTrackDay>(ENDPOINTS.fueltrack.today, { params });
  return res.data;
}

export async function getScoreHistory(email: string, days = 7): Promise<FuelTrackDay[]> {
  const res = await apiClient.get<FuelTrackDay[]>(ENDPOINTS.fueltrack.history, {
    params: { email, days },
  });
  return res.data;
}

export async function logWalk(
  email: string,
  walk: WalkLogEntry,
): Promise<any> {
  const res = await apiClient.post(ENDPOINTS.fueltrack.walk, { email, ...walk });
  return res.data;
}

export async function syncHealthData(
  email: string,
  date: string,
  walks: WalkLogEntry[],
): Promise<{ walks: any[]; score: FuelTrackBreakdown }> {
  const res = await apiClient.post(ENDPOINTS.fueltrack.syncHealth, { email, date, walks });
  return res.data;
}

export async function recalculateScore(email: string, date?: string): Promise<FuelTrackBreakdown> {
  const params: Record<string, string> = { email };
  if (date) params.date = date;
  const res = await apiClient.get<FuelTrackBreakdown>(ENDPOINTS.fueltrack.recalculate, { params });
  return res.data;
}
