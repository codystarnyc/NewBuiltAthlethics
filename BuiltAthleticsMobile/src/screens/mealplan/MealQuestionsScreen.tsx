import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMealPlanStore } from '../../store/useMealPlanStore';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { ReferralScreenProps } from '../../navigation/types';

const DIETS = ['None', 'Keto', 'Vegan', 'Vegetarian', 'Paleo', 'Mediterranean', 'High Protein'];
const ALLERGIES = ['Dairy', 'Gluten', 'Nuts', 'Soy', 'Eggs', 'Shellfish'];

export default function MealQuestionsScreen({ navigation }: ReferralScreenProps<'MealQuestions'>) {
  const setPreferences = useMealPlanStore((s) => s.setPreferences);
  const [selectedDiet, setSelectedDiet] = useState('None');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

  function toggleAllergy(a: string) {
    setSelectedAllergies((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  }

  function handleSave() {
    setPreferences({
      diet: selectedDiet === 'None' ? undefined : selectedDiet.toLowerCase(),
      allergies: selectedAllergies.length > 0 ? selectedAllergies : undefined,
    });
    Alert.alert('Saved', 'Your preferences have been updated');
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Meal Preferences</Text>

        <Text style={styles.label}>Diet Type</Text>
        <View style={styles.chipRow}>
          {DIETS.map((d) => (
            <TouchableOpacity key={d} style={[styles.chip, selectedDiet === d && styles.chipActive]} onPress={() => setSelectedDiet(d)}>
              <Text style={[styles.chipText, selectedDiet === d && styles.chipTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Allergies / Restrictions</Text>
        <View style={styles.chipRow}>
          {ALLERGIES.map((a) => (
            <TouchableOpacity key={a} style={[styles.chip, selectedAllergies.includes(a) && styles.chipActive]} onPress={() => toggleAllergy(a)}>
              <Text style={[styles.chipText, selectedAllergies.includes(a) && styles.chipTextActive]}>{a}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Preferences</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  scroll: { padding: SPACING.lg },
  heading: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.text, marginBottom: SPACING.lg },
  label: { fontSize: FONT_SIZES.md, fontWeight: '700', color: APP_COLORS.text, marginBottom: 8, marginTop: SPACING.md },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: APP_COLORS.border, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: APP_COLORS.surface },
  chipActive: { backgroundColor: APP_COLORS.primary, borderColor: APP_COLORS.primary },
  chipText: { fontSize: FONT_SIZES.sm, color: APP_COLORS.text },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  button: { backgroundColor: APP_COLORS.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: SPACING.xl },
  buttonText: { color: '#fff', fontSize: FONT_SIZES.lg, fontWeight: '700' },
});
