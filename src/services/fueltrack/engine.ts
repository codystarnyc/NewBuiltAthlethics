import { prisma } from '../db';
import { computeInsulinScore } from '../ai/edamam';

const RULE_MAX = 20;
const RULES_COUNT = 5;

export interface FuelTrackBreakdown {
  pfcScore: number;
  postMealWalkScore: number;
  fastedWalkScore: number;
  insulinScoreValue: number;
  complianceBonus: number;
  overallScore: number;
}

/**
 * Recalculate and persist the FuelTrack score for a given user+date.
 * Called after food diary entries change or walk data syncs.
 */
export async function recalculateDay(userId: string, date: string): Promise<FuelTrackBreakdown> {
  const pfc = await scorePFC(userId, date);
  const postMealWalks = await scorePostMealWalks(userId, date);
  const fastedWalk = await scoreFastedWalk(userId, date);
  const insulin = await scoreInsulin(userId, date);
  const compliance = scoreCompliance(pfc, postMealWalks.score, fastedWalk.score, insulin);

  const overall = pfc + postMealWalks.score + fastedWalk.score + insulin + compliance;

  await prisma.fuelTrackDay.upsert({
    where: { userId_date: { userId, date } },
    create: {
      userId,
      date,
      pfcScore: pfc,
      postMealWalks: postMealWalks.count,
      fastedWalk: fastedWalk.detected,
      insulinScore: insulin,
      overallScore: overall,
    },
    update: {
      pfcScore: pfc,
      postMealWalks: postMealWalks.count,
      fastedWalk: fastedWalk.detected,
      insulinScore: insulin,
      overallScore: overall,
    },
  });

  return {
    pfcScore: pfc,
    postMealWalkScore: postMealWalks.score,
    fastedWalkScore: fastedWalk.score,
    insulinScoreValue: insulin,
    complianceBonus: compliance,
    overallScore: overall,
  };
}

/**
 * Rule 1: PFC Sequencing (0-20).
 * Scores meals based on protein-to-carb ratio. Higher protein meals = better PFC adherence.
 */
async function scorePFC(userId: string, date: string): Promise<number> {
  const dayStart = new Date(`${date}T00:00:00Z`);
  const dayEnd = new Date(dayStart.getTime() + 86_400_000);

  const entries = await prisma.foodDiaryEntry.findMany({
    where: { userId, date: { gte: dayStart, lt: dayEnd } },
  });

  if (entries.length === 0) return 0;

  let totalScore = 0;
  for (const entry of entries) {
    const total = entry.protein + entry.carbs + entry.fat;
    if (total === 0) continue;

    const proteinRatio = entry.protein / total;
    if (proteinRatio >= 0.35) totalScore += RULE_MAX;
    else if (proteinRatio >= 0.25) totalScore += 15;
    else if (proteinRatio >= 0.15) totalScore += 10;
    else totalScore += 5;
  }

  return Math.min(RULE_MAX, Math.round(totalScore / entries.length));
}

/**
 * Rule 2: Post-Meal Walks (0-20).
 * Detect walks within 30 minutes after any logged meal.
 */
async function scorePostMealWalks(
  userId: string,
  date: string,
): Promise<{ score: number; count: number }> {
  const dayStart = new Date(`${date}T00:00:00Z`);
  const dayEnd = new Date(dayStart.getTime() + 86_400_000);

  const meals = await prisma.foodDiaryEntry.findMany({
    where: { userId, date: { gte: dayStart, lt: dayEnd } },
    select: { date: true, mealType: true },
    distinct: ['mealType'],
  });

  if (meals.length === 0) return { score: 0, count: 0 };

  const walks = await prisma.walkLog.findMany({
    where: { userId, date, type: 'post_meal' },
  });

  let matchedWalks = 0;
  for (const meal of meals) {
    const mealTime = meal.date.getTime();
    const windowEnd = mealTime + 45 * 60_000;

    const matched = walks.some(
      (w) => w.startTime.getTime() >= mealTime && w.startTime.getTime() <= windowEnd,
    );
    if (matched) matchedWalks++;
  }

  const ratio = matchedWalks / meals.length;
  return { score: Math.round(ratio * RULE_MAX), count: matchedWalks };
}

/**
 * Rule 3: Fasted Walk (0-20).
 * Detect a walk before the first meal of the day.
 */
async function scoreFastedWalk(
  userId: string,
  date: string,
): Promise<{ score: number; detected: boolean }> {
  const dayStart = new Date(`${date}T00:00:00Z`);
  const dayEnd = new Date(dayStart.getTime() + 86_400_000);

  const firstMeal = await prisma.foodDiaryEntry.findFirst({
    where: { userId, date: { gte: dayStart, lt: dayEnd } },
    orderBy: { date: 'asc' },
    select: { date: true },
  });

  const fastedWalks = await prisma.walkLog.findMany({
    where: { userId, date, type: 'fasted' },
  });

  if (fastedWalks.length === 0) return { score: 0, detected: false };

  if (!firstMeal) {
    return { score: RULE_MAX, detected: true };
  }

  const walkBeforeMeal = fastedWalks.some(
    (w) => w.startTime.getTime() < firstMeal.date.getTime(),
  );

  return { score: walkBeforeMeal ? RULE_MAX : 0, detected: walkBeforeMeal };
}

/**
 * Rule 4: Insulin Scoring (0-20).
 * Average glycemic impact of all meals. Lower average GI = higher score.
 */
async function scoreInsulin(userId: string, date: string): Promise<number> {
  const dayStart = new Date(`${date}T00:00:00Z`);
  const dayEnd = new Date(dayStart.getTime() + 86_400_000);

  const entries = await prisma.foodDiaryEntry.findMany({
    where: { userId, date: { gte: dayStart, lt: dayEnd } },
  });

  if (entries.length === 0) return 0;

  let totalInsulinScore = 0;
  for (const entry of entries) {
    const gi = 55; // default moderate GI when specific data unavailable
    totalInsulinScore += computeInsulinScore(gi, entry.protein, entry.carbs, entry.fat);
  }

  const avgScore = totalInsulinScore / entries.length;

  if (avgScore <= 3) return RULE_MAX;
  if (avgScore <= 5) return 15;
  if (avgScore <= 7) return 10;
  return 5;
}

/**
 * Rule 5: Overall Compliance Bonus (0-20).
 * Bonus for hitting 3+ rules at >= 15 points each.
 */
function scoreCompliance(pfc: number, postMeal: number, fasted: number, insulin: number): number {
  const highScores = [pfc, postMeal, fasted, insulin].filter((s) => s >= 15).length;

  if (highScores >= 4) return RULE_MAX;
  if (highScores >= 3) return 15;
  if (highScores >= 2) return 10;
  if (highScores >= 1) return 5;
  return 0;
}

export async function getHistory(userId: string, days: number): Promise<any[]> {
  const records = await prisma.fuelTrackDay.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: days,
  });
  return records;
}
