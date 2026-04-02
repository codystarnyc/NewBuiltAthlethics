import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGenerateAIMealPlan } from '../../hooks/useMealPlan';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { GeneratedMealPlan } from '../../api/types';

const DIET_OPTIONS = ['None', 'High Protein', 'Keto', 'Vegan', 'Vegetarian', 'Mediterranean', 'Paleo'];

export default function CreateMealPlanScreen() {
  const [calorieTarget, setCalorieTarget] = useState('2000');
  const [proteinTarget, setProteinTarget] = useState('150');
  const [selectedDiet, setSelectedDiet] = useState('None');
  const [daysCount, setDaysCount] = useState('7');
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedMealPlan | null>(null);

  const generateMutation = useGenerateAIMealPlan();

  async function handleGenerate() {
    const cal = parseInt(calorieTarget, 10);
    if (!cal || cal < 800 || cal > 10000) {
      return Alert.alert('Error', 'Calorie target must be between 800-10000');
    }

    try {
      const plan = await generateMutation.mutateAsync({
        calorieTarget: cal,
        proteinTarget: parseInt(proteinTarget, 10) || undefined,
        diet: selectedDiet === 'None' ? undefined : selectedDiet.toLowerCase(),
        daysCount: Math.min(parseInt(daysCount, 10) || 7, 14),
        mealsPerDay: 3,
      });
      setGeneratedPlan(plan);
    } catch {
      Alert.alert('Generation Failed', 'Could not generate meal plan. Please try again.');
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {!generatedPlan ? (
          <>
            <Text style={styles.heading}>Create AI Meal Plan</Text>
            <Text style={styles.subheading}>Set your targets and preferences</Text>

            <Text style={styles.label}>Daily Calorie Target</Text>
            <TextInput
              style={styles.input}
              value={calorieTarget}
              onChangeText={setCalorieTarget}
              keyboardType="numeric"
              placeholder="2000"
              placeholderTextColor={APP_COLORS.textLight}
            />

            <Text style={styles.label}>Protein Target (g)</Text>
            <TextInput
              style={styles.input}
              value={proteinTarget}
              onChangeText={setProteinTarget}
              keyboardType="numeric"
              placeholder="150"
              placeholderTextColor={APP_COLORS.textLight}
            />

            <Text style={styles.label}>Number of Days</Text>
            <TextInput
              style={styles.input}
              value={daysCount}
              onChangeText={setDaysCount}
              keyboardType="numeric"
              placeholder="7"
              placeholderTextColor={APP_COLORS.textLight}
            />

            <Text style={styles.label}>Diet Preference</Text>
            <View style={styles.dietRow}>
              {DIET_OPTIONS.map((diet) => (
                <TouchableOpacity
                  key={diet}
                  style={[styles.dietChip, selectedDiet === diet && styles.dietChipActive]}
                  onPress={() => setSelectedDiet(diet)}
                >
                  <Text style={[styles.dietChipText, selectedDiet === diet && styles.dietChipTextActive]}>
                    {diet}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.generateButton, generateMutation.isPending && styles.buttonDisabled]}
              onPress={handleGenerate}
              disabled={generateMutation.isPending}
            >
              {generateMutation.isPending ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#fff" />
                  <Text style={styles.generateButtonText}>  Generating...</Text>
                </View>
              ) : (
                <Text style={styles.generateButtonText}>Generate Meal Plan</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.resultHeader}>
              <Text style={styles.heading}>Your AI Meal Plan</Text>
              <TouchableOpacity onPress={() => setGeneratedPlan(null)}>
                <Text style={styles.resetText}>New Plan</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Daily Averages</Text>
              <View style={styles.summaryRow}>
                <SummaryItem label="Calories" value={`${Math.round(generatedPlan.summary.avgCalories)}`} />
                <SummaryItem label="Protein" value={`${Math.round(generatedPlan.summary.avgProtein)}g`} />
                <SummaryItem label="Carbs" value={`${Math.round(generatedPlan.summary.avgCarbs)}g`} />
                <SummaryItem label="Fat" value={`${Math.round(generatedPlan.summary.avgFat)}g`} />
              </View>
            </View>

            {generatedPlan.days.map((day) => (
              <View key={day.day} style={styles.dayCard}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayTitle}>Day {day.day}</Text>
                  <Text style={styles.dayCal}>{Math.round(day.totals.calories)} kcal</Text>
                </View>
                {day.meals.map((meal, i) => (
                  <View key={i} style={styles.mealRow}>
                    <Text style={styles.mealType}>{meal.type.toUpperCase()}</Text>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <Text style={styles.mealMacros}>
                      {Math.round(meal.calories)} cal | P:{Math.round(meal.protein)}g C:{Math.round(meal.carbs)}g F:{Math.round(meal.fat)}g
                    </Text>
                    {meal.ingredients.length > 0 && (
                      <Text style={styles.ingredients}>
                        {meal.ingredients.map((ing) => `${ing.amount} ${ing.name}`).join(', ')}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={sumStyles.item}>
      <Text style={sumStyles.value}>{value}</Text>
      <Text style={sumStyles.label}>{label}</Text>
    </View>
  );
}

const sumStyles = StyleSheet.create({
  item: { alignItems: 'center', flex: 1 },
  value: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: APP_COLORS.primary },
  label: { fontSize: FONT_SIZES.xs, color: APP_COLORS.textSecondary, marginTop: 2 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  scroll: { padding: SPACING.lg },
  heading: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.text },
  subheading: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, marginTop: 4, marginBottom: SPACING.lg },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: APP_COLORS.text,
    marginBottom: 6,
    marginTop: SPACING.md,
  },
  input: {
    backgroundColor: APP_COLORS.surface,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    fontSize: FONT_SIZES.lg,
    color: APP_COLORS.text,
  },
  dietRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  dietChip: {
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: APP_COLORS.surface,
  },
  dietChipActive: { backgroundColor: APP_COLORS.primary, borderColor: APP_COLORS.primary },
  dietChipText: { fontSize: FONT_SIZES.sm, color: APP_COLORS.text },
  dietChipTextActive: { color: '#fff', fontWeight: '600' },
  generateButton: {
    backgroundColor: APP_COLORS.primary,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  buttonDisabled: { opacity: 0.6 },
  generateButtonText: { color: '#fff', fontSize: FONT_SIZES.lg, fontWeight: '700' },
  loadingRow: { flexDirection: 'row', alignItems: 'center' },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  resetText: { fontSize: FONT_SIZES.md, color: APP_COLORS.accent, fontWeight: '600' },
  summaryCard: {
    backgroundColor: APP_COLORS.surface,
    borderRadius: 14,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  summaryTitle: { fontSize: FONT_SIZES.md, fontWeight: '700', color: APP_COLORS.text, marginBottom: SPACING.sm },
  summaryRow: { flexDirection: 'row' },
  dayCard: {
    backgroundColor: APP_COLORS.surface,
    borderRadius: 14,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  dayTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: APP_COLORS.text },
  dayCal: { fontSize: FONT_SIZES.md, fontWeight: '700', color: APP_COLORS.primary },
  mealRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: APP_COLORS.border },
  mealType: { fontSize: FONT_SIZES.xs, fontWeight: '700', color: APP_COLORS.textSecondary, letterSpacing: 0.5 },
  mealName: { fontSize: FONT_SIZES.md, fontWeight: '600', color: APP_COLORS.text, marginTop: 2 },
  mealMacros: { fontSize: FONT_SIZES.sm, color: APP_COLORS.textSecondary, marginTop: 4 },
  ingredients: { fontSize: FONT_SIZES.xs, color: APP_COLORS.textLight, marginTop: 4, fontStyle: 'italic' },
});
