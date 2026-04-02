import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as fueltrackApi from '../api/fueltrack';
import type { WalkLogEntry } from '../api/types';

export function useTodayScore(email: string | undefined, date?: string) {
  return useQuery({
    queryKey: ['fueltrack', 'today', email, date],
    queryFn: () => fueltrackApi.getTodayScore(email!, date),
    enabled: !!email,
    staleTime: 30_000,
  });
}

export function useScoreHistory(email: string | undefined, days = 7) {
  return useQuery({
    queryKey: ['fueltrack', 'history', email, days],
    queryFn: () => fueltrackApi.getScoreHistory(email!, days),
    enabled: !!email,
    staleTime: 60_000,
  });
}

export function useLogWalk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ email, walk }: { email: string; walk: WalkLogEntry }) =>
      fueltrackApi.logWalk(email, walk),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['fueltrack'] });
    },
  });
}

export function useSyncHealth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ email, date, walks }: { email: string; date: string; walks: WalkLogEntry[] }) =>
      fueltrackApi.syncHealthData(email, date, walks),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['fueltrack'] });
    },
  });
}
