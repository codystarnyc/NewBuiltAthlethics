import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecipes } from '../../hooks/useMealPlan';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { ReferralScreenProps } from '../../navigation/types';
import type { Recipe } from '../../api/types';

export default function RecipeListScreen({ navigation }: ReferralScreenProps<'RecipeList'>) {
  const { data: recipes, isLoading } = useRecipes();

  function renderRecipe({ item }: { item: Recipe }) {
    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RecipeDetails', { recipeId: item.id })}>
        <View style={styles.cardBody}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.macros}>{item.calories} cal | P:{item.protein}g C:{item.carbs}g F:{item.fat}g</Text>
          {item.prepTime ? <Text style={styles.time}>Prep: {item.prepTime} min</Text> : null}
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {isLoading && <View style={styles.center}><ActivityIndicator size="large" color={APP_COLORS.primary} /></View>}
      {!isLoading && (!recipes || recipes.length === 0) && (
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>No Recipes</Text>
          <Text style={styles.emptySub}>Generate a meal plan to get recipe suggestions</Text>
        </View>
      )}
      {recipes && recipes.length > 0 && (
        <FlatList data={recipes} keyExtractor={(r) => r.id} renderItem={renderRecipe} contentContainerStyle={styles.list} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  list: { padding: SPACING.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg },
  emptyTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: APP_COLORS.text },
  emptySub: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, marginTop: 4, textAlign: 'center' },
  card: { flexDirection: 'row', backgroundColor: APP_COLORS.surface, borderRadius: 14, padding: SPACING.md, marginBottom: 8, alignItems: 'center' },
  cardBody: { flex: 1 },
  name: { fontSize: FONT_SIZES.md, fontWeight: '600', color: APP_COLORS.text },
  macros: { fontSize: FONT_SIZES.sm, color: APP_COLORS.textSecondary, marginTop: 4 },
  time: { fontSize: FONT_SIZES.xs, color: APP_COLORS.textLight, marginTop: 2 },
  arrow: { fontSize: 20, color: APP_COLORS.textLight, marginLeft: 8 },
});
