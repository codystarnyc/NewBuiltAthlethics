import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { ReferralScreenProps } from '../../navigation/types';

export default function RecipeDetailsScreen({ route }: ReferralScreenProps<'RecipeDetails'>) {
  const { recipeId } = route.params;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Recipe</Text>
        <Text style={styles.id}>ID: {recipeId}</Text>

        <View style={styles.macroRow}>
          {['Calories', 'Protein', 'Carbs', 'Fat'].map((m) => (
            <View key={m} style={styles.macroItem}>
              <Text style={styles.macroValue}>—</Text>
              <Text style={styles.macroLabel}>{m}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <Text style={styles.placeholder}>Ingredients will appear here once a recipe is loaded</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.placeholder}>Step-by-step instructions will appear here</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  scroll: { padding: SPACING.lg },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.text },
  id: { fontSize: FONT_SIZES.sm, color: APP_COLORS.textSecondary, marginTop: 4, marginBottom: SPACING.lg },
  macroRow: { flexDirection: 'row', backgroundColor: APP_COLORS.surface, borderRadius: 14, padding: SPACING.md, marginBottom: SPACING.lg },
  macroItem: { flex: 1, alignItems: 'center' },
  macroValue: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: APP_COLORS.primary },
  macroLabel: { fontSize: FONT_SIZES.xs, color: APP_COLORS.textSecondary, marginTop: 2 },
  section: { backgroundColor: APP_COLORS.surface, borderRadius: 14, padding: SPACING.lg, marginBottom: SPACING.md },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: APP_COLORS.text, marginBottom: SPACING.sm },
  placeholder: { fontSize: FONT_SIZES.md, color: APP_COLORS.textLight },
});
