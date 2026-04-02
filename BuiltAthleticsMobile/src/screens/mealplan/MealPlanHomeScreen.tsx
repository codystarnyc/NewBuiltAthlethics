import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMealPlan } from '../../hooks/useMealPlan';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { ReferralScreenProps } from '../../navigation/types';

export default function MealPlanHomeScreen({ navigation }: ReferralScreenProps<'MealPlanHome'>) {
  const { data: plan, isLoading } = useMealPlan();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Meal Plan</Text>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={() => navigation.navigate('CreateMealPlan')}
          >
            <Text style={styles.generateText}>+ Generate AI Plan</Text>
          </TouchableOpacity>
        </View>

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={APP_COLORS.primary} />
          </View>
        )}

        {!isLoading && !plan && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>AI</Text>
            </View>
            <Text style={styles.emptyTitle}>No Meal Plan Yet</Text>
            <Text style={styles.emptySub}>
              Generate a personalized AI meal plan based on your calorie and macro targets
            </Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate('CreateMealPlan')}
            >
              <Text style={styles.ctaText}>Create Meal Plan</Text>
            </TouchableOpacity>
          </View>
        )}

        {plan && plan.meals && plan.meals.map((day, index) => (
          <View key={index} style={styles.dayCard}>
            <Text style={styles.dayTitle}>Day {day.day}</Text>
            <View style={styles.dayMacros}>
              <Text style={styles.dayCalories}>{day.totalCalories} kcal</Text>
              <Text style={styles.dayMacroText}>
                P: {day.totalProtein}g | C: {day.totalCarbs}g | F: {day.totalFat}g
              </Text>
            </View>
            {day.breakfast && <MealRow label="Breakfast" meal={day.breakfast.name} cal={day.breakfast.calories} />}
            {day.lunch && <MealRow label="Lunch" meal={day.lunch.name} cal={day.lunch.calories} />}
            {day.dinner && <MealRow label="Dinner" meal={day.dinner.name} cal={day.dinner.calories} />}
            {day.snack && <MealRow label="Snack" meal={day.snack.name} cal={day.snack.calories} />}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function MealRow({ label, meal, cal }: { label: string; meal: string; cal: number }) {
  return (
    <View style={mealStyles.row}>
      <View>
        <Text style={mealStyles.label}>{label}</Text>
        <Text style={mealStyles.name}>{meal}</Text>
      </View>
      <Text style={mealStyles.cal}>{cal} cal</Text>
    </View>
  );
}

const mealStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.border,
  },
  label: { fontSize: FONT_SIZES.xs, color: APP_COLORS.textSecondary, textTransform: 'uppercase', fontWeight: '600' },
  name: { fontSize: FONT_SIZES.md, color: APP_COLORS.text, marginTop: 2 },
  cal: { fontSize: FONT_SIZES.md, fontWeight: '600', color: APP_COLORS.primary },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  scroll: { padding: SPACING.lg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.text },
  generateButton: {
    backgroundColor: APP_COLORS.accent,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  generateText: { color: '#fff', fontSize: FONT_SIZES.sm, fontWeight: '700' },
  loadingContainer: { paddingVertical: 60, alignItems: 'center' },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: APP_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  emptyIconText: { color: '#fff', fontSize: 24, fontWeight: '800' },
  emptyTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: APP_COLORS.text, marginBottom: 8 },
  emptySub: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, textAlign: 'center', paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  ctaButton: {
    backgroundColor: APP_COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  ctaText: { color: '#fff', fontSize: FONT_SIZES.lg, fontWeight: '700' },
  dayCard: {
    backgroundColor: APP_COLORS.surface,
    borderRadius: 14,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  dayTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: APP_COLORS.text, marginBottom: 4 },
  dayMacros: { marginBottom: SPACING.sm },
  dayCalories: { fontSize: FONT_SIZES.md, fontWeight: '700', color: APP_COLORS.primary },
  dayMacroText: { fontSize: FONT_SIZES.sm, color: APP_COLORS.textSecondary, marginTop: 2 },
});
