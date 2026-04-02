import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAddFoodDiaryEntry } from '../../hooks/useFoodDiary';
import { useFoodStore } from '../../store/useFoodStore';
import { useAuthStore } from '../../store/useAuthStore';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { FoodScreenProps } from '../../navigation/types';
import type { FoodDiaryEntry } from '../../api/types';

function NutrientRow({ label, value, unit }: { label: string; value?: number; unit?: string }) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      <Text style={rowStyles.value}>{value != null ? `${Math.round(value)}${unit ?? ''}` : '—'}</Text>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: APP_COLORS.border },
  label: { fontSize: FONT_SIZES.md, color: APP_COLORS.text },
  value: { fontSize: FONT_SIZES.md, fontWeight: '600', color: APP_COLORS.text },
});

export default function FoodDetailsScreen({ route, navigation }: FoodScreenProps<'FoodDetails'>) {
  const { foodId } = route.params;
  const email = useAuthStore((s) => s.user?.email);
  const selectedDate = useFoodStore((s) => s.selectedDate);
  const addMutation = useAddFoodDiaryEntry();

  const food = {
    id: foodId,
    name: 'Loading...',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    servingSize: '1',
    servingUnit: 'serving',
  };

  function handleAddToDiary(mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') {
    if (!email) return;

    const entry: FoodDiaryEntry = {
      id: `${foodId}-${Date.now()}`,
      email,
      date: selectedDate,
      mealType,
      foodId: food.id,
      foodName: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      servings: 1,
    };

    addMutation.mutate(entry, {
      onSuccess: () => {
        Alert.alert('Added', `${food.name} added to ${mealType}`);
        navigation.goBack();
      },
    });
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.name}>{food.name}</Text>
          {food.servingSize && (
            <Text style={styles.serving}>
              Serving: {food.servingSize} {food.servingUnit}
            </Text>
          )}
        </View>

        <View style={styles.macroCard}>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{Math.round(food.calories)}</Text>
            <Text style={styles.macroLabel}>Calories</Text>
          </View>
          <View style={styles.macroDivider} />
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{Math.round(food.protein)}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          <View style={styles.macroDivider} />
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{Math.round(food.carbs)}g</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>
          <View style={styles.macroDivider} />
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{Math.round(food.fat)}g</Text>
            <Text style={styles.macroLabel}>Fat</Text>
          </View>
        </View>

        <View style={styles.nutrientCard}>
          <Text style={styles.sectionTitle}>Nutrition Facts</Text>
          <NutrientRow label="Calories" value={food.calories} unit=" kcal" />
          <NutrientRow label="Protein" value={food.protein} unit="g" />
          <NutrientRow label="Carbohydrates" value={food.carbs} unit="g" />
          <NutrientRow label="Fat" value={food.fat} unit="g" />
          <NutrientRow label="Fiber" value={food.fiber} unit="g" />
          <NutrientRow label="Sugar" value={food.sugar} unit="g" />
          <NutrientRow label="Sodium" value={food.sodium} unit="mg" />
        </View>

        <View style={styles.addSection}>
          <Text style={styles.sectionTitle}>Add to Diary</Text>
          {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((meal) => (
            <TouchableOpacity
              key={meal}
              style={styles.mealButton}
              onPress={() => handleAddToDiary(meal)}
            >
              <Text style={styles.mealButtonText}>
                + {meal.charAt(0).toUpperCase() + meal.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  scroll: { padding: SPACING.lg },
  header: { marginBottom: SPACING.lg },
  name: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.text },
  serving: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, marginTop: 4 },
  macroCard: {
    flexDirection: 'row',
    backgroundColor: APP_COLORS.surface,
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  macroItem: { flex: 1, alignItems: 'center' },
  macroValue: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: APP_COLORS.primary },
  macroLabel: { fontSize: FONT_SIZES.xs, color: APP_COLORS.textSecondary, marginTop: 2 },
  macroDivider: { width: 1, backgroundColor: APP_COLORS.border },
  nutrientCard: {
    backgroundColor: APP_COLORS.surface,
    borderRadius: 14,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: APP_COLORS.text, marginBottom: SPACING.sm },
  addSection: {
    backgroundColor: APP_COLORS.surface,
    borderRadius: 14,
    padding: SPACING.lg,
  },
  mealButton: {
    borderWidth: 1,
    borderColor: APP_COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  mealButtonText: { fontSize: FONT_SIZES.md, fontWeight: '600', color: APP_COLORS.primary },
});
