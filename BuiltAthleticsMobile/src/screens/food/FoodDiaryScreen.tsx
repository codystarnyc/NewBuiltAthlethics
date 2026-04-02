import React, { useCallback, useState } from 'react';
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
import { useFoodStore } from '../../store/useFoodStore';
import { useFuelTrackStore } from '../../store/useFuelTrackStore';
import * as foodApi from '../../api/food';
import * as fueltrackApi from '../../api/fueltrack';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { FoodScreenProps } from '../../navigation/types';
import type { FoodDiaryEntry } from '../../api/types';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

function MealSection({
  mealType,
  entries,
  onAddPress,
}: {
  mealType: string;
  entries: FoodDiaryEntry[];
  onAddPress: () => void;
}) {
  const total = entries.reduce((sum, e) => sum + (e.calories ?? 0), 0);

  return (
    <View style={sectionStyles.container}>
      <View style={sectionStyles.header}>
        <Text style={sectionStyles.title}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</Text>
        <Text style={sectionStyles.calories}>{Math.round(total)} kcal</Text>
      </View>
      {entries.map((entry) => (
        <View key={entry.id} style={sectionStyles.entry}>
          <View style={{ flex: 1 }}>
            <Text style={sectionStyles.foodName}>{entry.foodName}</Text>
            {entry.servings ? (
              <Text style={sectionStyles.servingText}>{entry.servings} serving(s)</Text>
            ) : null}
          </View>
          <View style={sectionStyles.macros}>
            <Text style={sectionStyles.foodCal}>{Math.round(entry.calories ?? 0)}</Text>
            <Text style={sectionStyles.macroDetail}>
              P:{Math.round(entry.protein ?? 0)} C:{Math.round(entry.carbs ?? 0)} F:{Math.round(entry.fat ?? 0)}
            </Text>
          </View>
        </View>
      ))}
      <TouchableOpacity style={sectionStyles.addButton} onPress={onAddPress}>
        <Text style={sectionStyles.addText}>+ Add Food</Text>
      </TouchableOpacity>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  container: {
    backgroundColor: APP_COLORS.surface,
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  title: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: APP_COLORS.text },
  calories: { fontSize: FONT_SIZES.md, fontWeight: '600', color: APP_COLORS.primary },
  entry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.border,
  },
  foodName: { fontSize: FONT_SIZES.md, color: APP_COLORS.text },
  servingText: { fontSize: FONT_SIZES.xs, color: APP_COLORS.textSecondary, marginTop: 1 },
  macros: { alignItems: 'flex-end' },
  foodCal: { fontSize: FONT_SIZES.md, fontWeight: '600', color: APP_COLORS.text },
  macroDetail: { fontSize: FONT_SIZES.xs, color: APP_COLORS.textSecondary, marginTop: 1 },
  addButton: { paddingTop: SPACING.sm },
  addText: { fontSize: FONT_SIZES.md, color: APP_COLORS.primaryLight, fontWeight: '600' },
});

export default function FoodDiaryScreen({ navigation }: FoodScreenProps<'FoodDiary'>) {
  const user = useAuthStore((s) => s.user);
  const selectedDate = useFoodStore((s) => s.selectedDate);
  const setDiaryEntries = useFoodStore((s) => s.setDiaryEntries);
  const entries = useFoodStore((s) => s.diaryEntries);
  const totals = useFoodStore((s) => s.dailyTotals);
  const setTodayScore = useFuelTrackStore((s) => s.setTodayScore);
  const fuelScore = useFuelTrackStore((s) => s.todayScore);

  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!user?.email) return;
      let cancelled = false;
      (async () => {
        try {
          setLoading(true);
          const [data, score] = await Promise.all([
            foodApi.getFoodDiary(user.email, selectedDate),
            fueltrackApi.getTodayScore(user.email, selectedDate).catch(() => null),
          ]);
          if (!cancelled) {
            setDiaryEntries(Array.isArray(data) ? data : []);
            if (score) setTodayScore(score);
          }
        } catch {
          if (!cancelled) setDiaryEntries([]);
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
      return () => { cancelled = true; };
    }, [user?.email, selectedDate, setDiaryEntries, setTodayScore]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.dateText}>{selectedDate}</Text>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => navigation.navigate('CalorieMama')}
        >
          <Text style={styles.cameraIcon}>AI</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{Math.round(totals.calories)}</Text>
          <Text style={styles.summaryLabel}>Calories</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{Math.round(totals.protein)}g</Text>
          <Text style={styles.summaryLabel}>Protein</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{Math.round(totals.carbs)}g</Text>
          <Text style={styles.summaryLabel}>Carbs</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{Math.round(totals.fat)}g</Text>
          <Text style={styles.summaryLabel}>Fat</Text>
        </View>
      </View>

      {fuelScore && (
        <TouchableOpacity
          style={styles.fuelBadge}
          onPress={() => navigation.navigate('FuelTrack')}
          activeOpacity={0.7}
        >
          <Text style={styles.fuelLabel}>FuelTrack</Text>
          <Text style={styles.fuelScore}>{Math.round(fuelScore.overallScore)}/100</Text>
          <Text style={styles.fuelDetail}>
            PFC:{Math.round(fuelScore.pfcScore)} | Insulin:{Math.round(fuelScore.insulinScore)}
          </Text>
          <Text style={styles.fuelArrow}>›</Text>
        </TouchableOpacity>
      )}

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={APP_COLORS.primary} size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {MEAL_TYPES.map((type) => (
            <MealSection
              key={type}
              mealType={type}
              entries={entries.filter((e) => e.mealType === type)}
              onAddPress={() => navigation.navigate('FoodList', { mealType: type })}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  dateText: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: APP_COLORS.text },
  cameraButton: {
    backgroundColor: APP_COLORS.accent,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: { color: '#fff', fontSize: FONT_SIZES.sm, fontWeight: '800' },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: APP_COLORS.surface,
    marginHorizontal: SPACING.lg,
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: APP_COLORS.primary },
  summaryLabel: { fontSize: FONT_SIZES.xs, color: APP_COLORS.textSecondary, marginTop: 2 },
  summaryDivider: { width: 1, backgroundColor: APP_COLORS.border },
  scroll: { padding: SPACING.lg, paddingTop: 0 },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  fuelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_COLORS.surface,
    marginHorizontal: SPACING.lg,
    borderRadius: 10,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: APP_COLORS.success,
  },
  fuelLabel: { fontSize: FONT_SIZES.xs, fontWeight: '700', color: APP_COLORS.textSecondary },
  fuelScore: { fontSize: FONT_SIZES.md, fontWeight: '800', color: APP_COLORS.success },
  fuelDetail: { fontSize: FONT_SIZES.xs, color: APP_COLORS.textSecondary, flex: 1 },
  fuelArrow: { fontSize: 22, color: APP_COLORS.textSecondary, fontWeight: '300' },
});
