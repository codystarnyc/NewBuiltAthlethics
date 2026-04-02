import { Platform } from 'react-native';
import type { WalkLogEntry } from '../api/types';

export interface StepSample {
  startTime: string;
  endTime: string;
  steps: number;
}

let healthKitAvailable = false;
let googleFitAvailable = false;

/**
 * Request HealthKit (iOS) or Google Fit (Android) permissions.
 * Returns false in Expo Go since native modules aren't linked.
 */
export async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    try {
      const AppleHealthKit = require('react-native-health').default;
      const permissions = {
        permissions: {
          read: [
            AppleHealthKit.Constants.Permissions.StepCount,
            AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
          ],
        },
      };

      return new Promise((resolve) => {
        AppleHealthKit.initHealthKit(permissions, (err: unknown) => {
          if (err) {
            console.warn('HealthKit init failed:', err);
            resolve(false);
            return;
          }
          healthKitAvailable = true;
          resolve(true);
        });
      });
    } catch {
      console.warn('react-native-health not available (Expo Go?)');
      return false;
    }
  }

  if (Platform.OS === 'android') {
    try {
      const GoogleFit = require('react-native-google-fit').default;
      const options = { scopes: [GoogleFit.Scopes.FITNESS_ACTIVITY_READ] };
      const result = await GoogleFit.authorize(options);
      googleFitAvailable = result.success;
      return result.success;
    } catch {
      console.warn('react-native-google-fit not available (Expo Go?)');
      return false;
    }
  }

  return false;
}

/**
 * Fetch step samples for a given date, grouped by activity segments.
 */
export async function getStepSamples(date: string): Promise<StepSample[]> {
  const dayStart = `${date}T00:00:00.000Z`;
  const dayEnd = `${date}T23:59:59.999Z`;

  if (Platform.OS === 'ios' && healthKitAvailable) {
    try {
      const AppleHealthKit = require('react-native-health').default;
      return new Promise((resolve) => {
        AppleHealthKit.getSamples(
          {
            typeIdentifier: 'HKQuantityTypeIdentifierStepCount',
            startDate: dayStart,
            endDate: dayEnd,
            ascending: true,
          },
          (err: unknown, results: Array<{ startDate: string; endDate: string; value: number }>) => {
            if (err || !results) {
              resolve([]);
              return;
            }
            resolve(
              results.map((r) => ({
                startTime: r.startDate,
                endTime: r.endDate,
                steps: Math.round(r.value),
              })),
            );
          },
        );
      });
    } catch {
      return [];
    }
  }

  if (Platform.OS === 'android' && googleFitAvailable) {
    try {
      const GoogleFit = require('react-native-google-fit').default;
      const results = await GoogleFit.getDailyStepCountSamples({
        startDate: dayStart,
        endDate: dayEnd,
      });

      const estimated = results.find(
        (r: { source: string }) => r.source === 'com.google.android.gms:estimated_steps',
      );
      if (!estimated?.rawSteps) return [];

      return estimated.rawSteps.map((r: { startDate: string; endDate: string; steps: number }) => ({
        startTime: r.startDate,
        endTime: r.endDate,
        steps: r.steps,
      }));
    } catch {
      return [];
    }
  }

  return [];
}

/**
 * Detect walk sessions from step samples and correlate with meal times.
 */
export function detectWalks(steps: StepSample[], mealTimes: Date[]): WalkLogEntry[] {
  const walks: WalkLogEntry[] = [];
  const source: WalkLogEntry['source'] = Platform.OS === 'ios' ? 'apple_health' : 'google_fit';

  for (const sample of steps) {
    if (sample.steps < 200) continue;

    const start = new Date(sample.startTime);
    const end = new Date(sample.endTime);
    const durationMin = Math.round((end.getTime() - start.getTime()) / 60_000);
    if (durationMin < 5) continue;

    const isPostMeal = mealTimes.some((mt) => {
      const diff = start.getTime() - mt.getTime();
      return diff >= 0 && diff <= 45 * 60_000;
    });

    const isFasted = mealTimes.length === 0 || start.getTime() < mealTimes[0].getTime();

    if (isPostMeal) {
      const matchedMeal = mealTimes.find((mt) => {
        const diff = start.getTime() - mt.getTime();
        return diff >= 0 && diff <= 45 * 60_000;
      });

      walks.push({
        type: 'post_meal',
        startTime: sample.startTime,
        durationMin,
        steps: sample.steps,
        source,
        mealType: matchedMeal ? getMealTypeFromTime(matchedMeal) : undefined,
      });
    } else if (isFasted) {
      walks.push({
        type: 'fasted',
        startTime: sample.startTime,
        durationMin,
        steps: sample.steps,
        source,
      });
    }
  }

  return walks;
}

function getMealTypeFromTime(date: Date): string {
  const hour = date.getHours();
  if (hour < 11) return 'breakfast';
  if (hour < 15) return 'lunch';
  if (hour < 18) return 'snack';
  return 'dinner';
}

/**
 * Full sync: request permissions, fetch steps, detect walks, return entries.
 */
export async function syncWalksForDate(
  date: string,
  mealTimes: Date[],
): Promise<WalkLogEntry[]> {
  const granted = await requestPermissions();
  if (!granted) return [];

  const steps = await getStepSamples(date);
  return detectWalks(steps, mealTimes);
}
