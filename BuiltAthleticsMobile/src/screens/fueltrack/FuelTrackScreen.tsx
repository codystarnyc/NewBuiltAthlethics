import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../../store/useAuthStore';
import { useFuelTrackStore } from '../../store/useFuelTrackStore';
import * as fueltrackApi from '../../api/fueltrack';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';

const { width: SCREEN_W } = Dimensions.get('window');
const RING_SIZE = 160;
const RING_STROKE = 12;

function ScoreRing({ score, maxScore = 100 }: { score: number; maxScore?: number }) {
  const pct = Math.min(score / maxScore, 1);
  const color =
    pct >= 0.8 ? APP_COLORS.success :
    pct >= 0.5 ? APP_COLORS.warning :
    APP_COLORS.error;

  return (
    <View style={ringStyles.wrap}>
      <View style={[ringStyles.outer, { borderColor: APP_COLORS.border }]}>
        <View
          style={[
            ringStyles.fill,
            {
              borderColor: color,
              borderTopColor: pct > 0.25 ? color : 'transparent',
              borderRightColor: pct > 0.5 ? color : 'transparent',
              borderBottomColor: pct > 0.75 ? color : 'transparent',
            },
          ]}
        />
        <View style={ringStyles.inner}>
          <Text style={[ringStyles.score, { color }]}>{Math.round(score)}</Text>
          <Text style={ringStyles.label}>/ {maxScore}</Text>
        </View>
      </View>
    </View>
  );
}

const ringStyles = StyleSheet.create({
  wrap: { alignItems: 'center', marginVertical: SPACING.lg },
  outer: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: RING_STROKE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: RING_STROKE,
  },
  inner: { alignItems: 'center' },
  score: { fontSize: 40, fontWeight: '800' },
  label: { fontSize: FONT_SIZES.sm, color: APP_COLORS.textSecondary },
});

function RuleCard({
  title,
  score,
  maxScore = 20,
  description,
  icon,
}: {
  title: string;
  score: number;
  maxScore?: number;
  description: string;
  icon: string;
}) {
  const pct = maxScore > 0 ? score / maxScore : 0;
  const barColor =
    pct >= 0.75 ? APP_COLORS.success :
    pct >= 0.5 ? APP_COLORS.warning :
    APP_COLORS.error;

  return (
    <View style={ruleStyles.card}>
      <View style={ruleStyles.header}>
        <Text style={ruleStyles.icon}>{icon}</Text>
        <View style={{ flex: 1, marginLeft: SPACING.sm }}>
          <Text style={ruleStyles.title}>{title}</Text>
          <Text style={ruleStyles.desc}>{description}</Text>
        </View>
        <Text style={[ruleStyles.score, { color: barColor }]}>
          {Math.round(score)}/{maxScore}
        </Text>
      </View>
      <View style={ruleStyles.barBg}>
        <View style={[ruleStyles.barFill, { width: `${pct * 100}%`, backgroundColor: barColor }]} />
      </View>
    </View>
  );
}

const ruleStyles = StyleSheet.create({
  card: {
    backgroundColor: APP_COLORS.surface,
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  icon: { fontSize: 24 },
  title: { fontSize: FONT_SIZES.md, fontWeight: '700', color: APP_COLORS.text },
  desc: { fontSize: FONT_SIZES.xs, color: APP_COLORS.textSecondary, marginTop: 2 },
  score: { fontSize: FONT_SIZES.lg, fontWeight: '800' },
  barBg: {
    height: 6,
    backgroundColor: APP_COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: { height: 6, borderRadius: 3 },
});

function TrendBar({ day }: { day: { date: string; overallScore: number } }) {
  const pct = day.overallScore / 100;
  const h = Math.max(8, pct * 80);
  const color =
    pct >= 0.8 ? APP_COLORS.success :
    pct >= 0.5 ? APP_COLORS.warning :
    APP_COLORS.error;

  return (
    <View style={trendStyles.col}>
      <View style={[trendStyles.bar, { height: h, backgroundColor: color }]} />
      <Text style={trendStyles.dayLabel}>{day.date.slice(8)}</Text>
    </View>
  );
}

const trendStyles = StyleSheet.create({
  col: { alignItems: 'center', flex: 1 },
  bar: { width: 20, borderRadius: 4, minHeight: 8 },
  dayLabel: { fontSize: 9, color: APP_COLORS.textSecondary, marginTop: 4 },
});

export default function FuelTrackScreen() {
  const user = useAuthStore((s) => s.user);
  const { todayScore, history, setTodayScore, setHistory } = useFuelTrackStore();
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().slice(0, 10);

  useFocusEffect(
    useCallback(() => {
      if (!user?.email) return;
      let cancelled = false;
      (async () => {
        try {
          setLoading(true);
          const [score, hist] = await Promise.all([
            fueltrackApi.getTodayScore(user.email, today),
            fueltrackApi.getScoreHistory(user.email, 7),
          ]);
          if (cancelled) return;
          setTodayScore(score);
          setHistory(Array.isArray(hist) ? hist : []);
        } catch {
          // keep cached
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
      return () => { cancelled = true; };
    }, [user?.email, today, setTodayScore, setHistory]),
  );

  const score = todayScore;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.screenTitle}>FuelTrack</Text>
        <Text style={styles.subtitle}>{today}</Text>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={APP_COLORS.primary} size="large" />
          </View>
        ) : (
          <>
            <ScoreRing score={score?.overallScore ?? 0} />

            <RuleCard
              icon="P"
              title="PFC Sequencing"
              description="Eat protein first, then fats, then carbs"
              score={score?.pfcScore ?? 0}
            />
            <RuleCard
              icon="W"
              title="Post-Meal Walks"
              description={`${score?.postMealWalks ?? 0} walk(s) after meals today`}
              score={Math.round(((score?.postMealWalks ?? 0) / Math.max(1, 3)) * 20)}
            />
            <RuleCard
              icon="F"
              title="Fasted Walk"
              description={score?.fastedWalk ? 'Completed this morning' : 'Walk before your first meal'}
              score={score?.fastedWalk ? 20 : 0}
            />
            <RuleCard
              icon="I"
              title="Insulin Score"
              description="Lower glycemic meals = better score"
              score={score?.insulinScore ?? 0}
            />

            {history.length > 0 && (
              <View style={styles.trendCard}>
                <Text style={styles.trendTitle}>7-Day Trend</Text>
                <View style={styles.trendRow}>
                  {history.slice(0, 7).reverse().map((d) => (
                    <TrendBar key={d.date} day={d} />
                  ))}
                </View>
              </View>
            )}

            {(score?.pfcScore ?? 0) < 10 && (
              <View style={styles.nudge}>
                <Text style={styles.nudgeTitle}>Tip: Eat Protein First</Text>
                <Text style={styles.nudgeText}>
                  Start each meal with your protein source before carbs. This slows glucose absorption and keeps insulin lower.
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  scroll: { padding: SPACING.lg },
  screenTitle: { fontSize: FONT_SIZES.xxl, fontWeight: '800', color: APP_COLORS.text },
  subtitle: { fontSize: FONT_SIZES.sm, color: APP_COLORS.textSecondary, marginTop: 2 },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  trendCard: {
    backgroundColor: APP_COLORS.surface,
    borderRadius: 14,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  trendTitle: { fontSize: FONT_SIZES.md, fontWeight: '700', color: APP_COLORS.text, marginBottom: SPACING.md },
  trendRow: { flexDirection: 'row', alignItems: 'flex-end', height: 90 },
  nudge: {
    backgroundColor: '#FFF3E0',
    borderRadius: 14,
    padding: SPACING.md,
    marginTop: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: APP_COLORS.accent,
  },
  nudgeTitle: { fontSize: FONT_SIZES.md, fontWeight: '700', color: APP_COLORS.text, marginBottom: 4 },
  nudgeText: { fontSize: FONT_SIZES.sm, color: APP_COLORS.textSecondary, lineHeight: 20 },
});
