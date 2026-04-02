import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFoodSearch } from '../../hooks/useFoodDiary';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { FoodScreenProps } from '../../navigation/types';
import type { Food } from '../../api/types';

export default function FoodListScreen({ navigation, route }: FoodScreenProps<'FoodList'>) {
  const mealType = route.params?.mealType;
  const [query, setQuery] = useState('');
  const { data: results, isLoading } = useFoodSearch(query);

  function handleFoodPress(food: Food) {
    navigation.navigate('FoodDetails', { foodId: food.id });
  }

  function renderFoodItem({ item }: { item: Food }) {
    return (
      <TouchableOpacity style={styles.foodRow} onPress={() => handleFoodPress(item)}>
        <View style={styles.foodInfo}>
          {item.brand ? <Text style={styles.brand}>{item.brand}</Text> : null}
          <Text style={styles.foodName}>{item.name}</Text>
        </View>
        <View style={styles.foodRight}>
          <Text style={styles.calories}>{item.calories ?? '—'} cal</Text>
          <Text style={styles.arrow}>›</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search food..."
          placeholderTextColor={APP_COLORS.textLight}
          autoFocus
          returnKeyType="search"
        />
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('CalorieMama')}
        >
          <Text style={styles.iconText}>AI</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('BarcodeScanner')}
        >
          <Text style={styles.iconText}>||</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('CreateFood')}
        >
          <Text style={styles.iconText}>+</Text>
        </TouchableOpacity>
      </View>

      {mealType && (
        <View style={styles.mealBadge}>
          <Text style={styles.mealBadgeText}>Adding to: {mealType}</Text>
        </View>
      )}

      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={APP_COLORS.primary} />
        </View>
      )}

      {!isLoading && query.length >= 2 && (!results || results.length === 0) && (
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptySub}>Try a different search or add a custom food</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('CreateFood')}
          >
            <Text style={styles.addButtonText}>+ Add Custom Food</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isLoading && query.length < 2 && (
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>Search Food Database</Text>
          <Text style={styles.emptySub}>Type at least 2 characters to search</Text>
        </View>
      )}

      {results && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderFoodItem}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.border,
  },
  searchInput: {
    flex: 1,
    backgroundColor: APP_COLORS.surface,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    borderRadius: 10,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    fontSize: FONT_SIZES.md,
    color: APP_COLORS.text,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: APP_COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { color: '#fff', fontSize: FONT_SIZES.sm, fontWeight: '800' },
  mealBadge: {
    backgroundColor: APP_COLORS.primaryLight + '15',
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
  },
  mealBadgeText: { fontSize: FONT_SIZES.sm, color: APP_COLORS.primaryLight, fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg },
  emptyTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: APP_COLORS.text, marginBottom: 4 },
  emptySub: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, textAlign: 'center' },
  addButton: {
    marginTop: SPACING.lg,
    backgroundColor: APP_COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: FONT_SIZES.md },
  list: { padding: SPACING.md },
  foodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: APP_COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    marginBottom: 8,
  },
  foodInfo: { flex: 1 },
  brand: { fontSize: FONT_SIZES.xs, color: APP_COLORS.textSecondary, marginBottom: 2 },
  foodName: { fontSize: FONT_SIZES.md, fontWeight: '600', color: APP_COLORS.text },
  foodRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  calories: { fontSize: FONT_SIZES.md, fontWeight: '600', color: APP_COLORS.primary },
  arrow: { fontSize: 20, color: APP_COLORS.textLight },
});
