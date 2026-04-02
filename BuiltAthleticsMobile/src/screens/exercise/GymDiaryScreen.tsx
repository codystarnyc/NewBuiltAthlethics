import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../../store/useAuthStore';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import * as exerciseApi from '../../api/exercise';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { ExerciseScreenProps } from '../../navigation/types';
import type { Workout } from '../../api/types';

const QUICK_ACTIONS = [
  { key: 'library', label: 'Workout Library', icon: '📚', screen: 'WorkoutLibrary' as const },
  { key: 'categories', label: 'Categories', icon: '🏋️', screen: 'ExerciseCategories' as const },
  { key: 'hiit', label: 'HIIT Timer', icon: '⏱️', screen: 'HiitTimer' as const },
  { key: 'videos', label: 'Videos', icon: '🎬', screen: 'VideoList' as const },
];

export default function GymDiaryScreen({ navigation }: ExerciseScreenProps<'GymDiary'>) {
  const user = useAuthStore((s) => s.user);
  const setTodaysWorkouts = useWorkoutStore((s) => s.setTodaysWorkouts);
  const today = new Date().toISOString().split('T')[0];

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkouts = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const data = await exerciseApi.getWorkout({ email: user.email, date: today });
      const list = Array.isArray(data) ? data : [];
      setWorkouts(list);
      setTodaysWorkouts(list);
    } catch {
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  }, [user?.email, today, setTodaysWorkouts]);

  useFocusEffect(
    useCallback(() => {
      fetchWorkouts();
    }, [fetchWorkouts]),
  );

  const totalSets = workouts.reduce((sum, w) => sum + (w.sets?.length ?? 0), 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Gym Diary</Text>
          <Text style={styles.date}>{today}</Text>
        </View>

        <View style={styles.quickActions}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.key}
              style={styles.actionCard}
              onPress={() => navigation.navigate(action.screen as never)}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Today's Workout</Text>
            {workouts.length > 0 && (
              <Text style={styles.cardSubtitle}>
                {workouts.length} exercise{workouts.length !== 1 ? 's' : ''} · {totalSets} sets
              </Text>
            )}
          </View>

          {loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator color={APP_COLORS.primary} />
            </View>
          ) : workouts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No exercises logged today</Text>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => navigation.navigate('WorkoutLibrary')}
              >
                <Text style={styles.startButtonText}>Start Workout</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {workouts.map((w) => (
                <View key={w.id} style={styles.workoutRow}>
                  <View style={styles.workoutInfo}>
                    <Text style={styles.workoutName}>{w.exerciseName}</Text>
                    <Text style={styles.workoutSets}>
                      {w.sets?.length ?? 0} set{(w.sets?.length ?? 0) !== 1 ? 's' : ''}
                      {w.sets && w.sets.length > 0
                        ? ` · Best: ${Math.max(...w.sets.map((s) => s.weight))}kg × ${w.sets[w.sets.indexOf(w.sets.reduce((a, b) => (b.weight > a.weight ? b : a)))].reps}`
                        : ''}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.viewBtn}
                    onPress={() =>
                      navigation.navigate('ExerciseDetails', {
                        exerciseId: w.exerciseId,
                        exerciseName: w.exerciseName ?? 'Exercise',
                      })
                    }
                  >
                    <Text style={styles.viewBtnText}>View</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                style={[styles.startButton, { marginTop: SPACING.md }]}
                onPress={() => navigation.navigate('WorkoutLibrary')}
              >
                <Text style={styles.startButtonText}>+ Add Exercise</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.routineButton}
          onPress={() => navigation.navigate('AddRoutine')}
        >
          <Text style={styles.routineButtonText}>+ Create New Routine</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  scroll: { padding: SPACING.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: SPACING.lg },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.text },
  date: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  actionCard: {
    width: '48%',
    backgroundColor: APP_COLORS.surface,
    borderRadius: 14,
    padding: SPACING.md,
    alignItems: 'center',
    flexGrow: 1,
  },
  actionIcon: { fontSize: 28, marginBottom: 6 },
  actionLabel: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: APP_COLORS.text },
  card: {
    backgroundColor: APP_COLORS.surface,
    borderRadius: 14,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: SPACING.md },
  cardTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: APP_COLORS.text },
  cardSubtitle: { fontSize: FONT_SIZES.sm, color: APP_COLORS.textSecondary },
  emptyState: { alignItems: 'center', paddingVertical: SPACING.lg },
  emptyText: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, marginBottom: SPACING.md },
  startButton: { backgroundColor: APP_COLORS.primary, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32, alignItems: 'center' },
  startButtonText: { color: '#fff', fontSize: FONT_SIZES.md, fontWeight: '700' },
  workoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.border,
  },
  workoutInfo: { flex: 1 },
  workoutName: { fontSize: FONT_SIZES.md, fontWeight: '600', color: APP_COLORS.text },
  workoutSets: { fontSize: FONT_SIZES.sm, color: APP_COLORS.textSecondary, marginTop: 2 },
  viewBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: APP_COLORS.primary },
  viewBtnText: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: APP_COLORS.primary },
  routineButton: {
    borderWidth: 1,
    borderColor: APP_COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  routineButtonText: { fontSize: FONT_SIZES.md, fontWeight: '600', color: APP_COLORS.primary },
});
