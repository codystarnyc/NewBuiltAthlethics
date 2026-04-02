import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShoppingList, useToggleShoppingItem, useClearShoppingList } from '../../hooks/useMealPlan';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { ShoppingListItem } from '../../api/types';

export default function ShoppingListScreen() {
  const { data: items, isLoading } = useShoppingList();
  const toggleMutation = useToggleShoppingItem();
  const clearMutation = useClearShoppingList();

  function renderItem({ item }: { item: ShoppingListItem }) {
    return (
      <TouchableOpacity style={styles.row} onPress={() => toggleMutation.mutate(item)}>
        <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
          {item.checked && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, item.checked && styles.nameChecked]}>{item.ingredientName}</Text>
          <Text style={styles.meta}>{item.amount} {item.unit} · {item.recipeName}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {isLoading && <View style={styles.center}><ActivityIndicator size="large" color={APP_COLORS.primary} /></View>}
      {!isLoading && (!items || items.length === 0) && (
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>Shopping List Empty</Text>
          <Text style={styles.emptySub}>Items from your meal plan will appear here</Text>
        </View>
      )}
      {items && items.length > 0 && (
        <>
          <FlatList data={items} keyExtractor={(i) => i.id} renderItem={renderItem} contentContainerStyle={styles.list} />
          <TouchableOpacity style={styles.clearButton} onPress={() => clearMutation.mutate()}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  list: { padding: SPACING.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg },
  emptyTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: APP_COLORS.text },
  emptySub: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: APP_COLORS.surface, borderRadius: 12, padding: SPACING.md, marginBottom: 8 },
  checkbox: { width: 28, height: 28, borderRadius: 8, borderWidth: 2, borderColor: APP_COLORS.border, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  checkboxChecked: { backgroundColor: APP_COLORS.success, borderColor: APP_COLORS.success },
  checkmark: { color: '#fff', fontWeight: '700', fontSize: 14 },
  info: { flex: 1 },
  name: { fontSize: FONT_SIZES.md, fontWeight: '600', color: APP_COLORS.text },
  nameChecked: { textDecorationLine: 'line-through', color: APP_COLORS.textLight },
  meta: { fontSize: FONT_SIZES.sm, color: APP_COLORS.textSecondary, marginTop: 2 },
  clearButton: { borderWidth: 1, borderColor: APP_COLORS.error, borderRadius: 12, paddingVertical: 14, alignItems: 'center', margin: SPACING.lg },
  clearText: { fontSize: FONT_SIZES.md, fontWeight: '600', color: APP_COLORS.error },
});
