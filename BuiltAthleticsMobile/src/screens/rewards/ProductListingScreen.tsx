import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { RewardsScreenProps } from '../../navigation/types';

const SAMPLE_PRODUCTS = [
  { id: '1', name: 'BA Performance Tee', price: 29.99, gymiles: 500 },
  { id: '2', name: 'Shaker Bottle', price: 14.99, gymiles: 250 },
  { id: '3', name: 'Resistance Bands Set', price: 24.99, gymiles: 400 },
  { id: '4', name: 'Gym Towel', price: 9.99, gymiles: 150 },
];

export default function ProductListingScreen({ navigation }: RewardsScreenProps<'ProductListing'>) {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={SAMPLE_PRODUCTS}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}>
            <View style={styles.imagePlaceholder}><Text style={styles.imageText}>🛍️</Text></View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>${item.price}</Text>
            <Text style={styles.gymiles}>or {item.gymiles} GYMILES</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  list: { padding: SPACING.md },
  row: { gap: SPACING.md, marginBottom: SPACING.md },
  card: { flex: 1, backgroundColor: APP_COLORS.surface, borderRadius: 14, padding: SPACING.md, alignItems: 'center' },
  imagePlaceholder: { width: '100%', height: 100, backgroundColor: APP_COLORS.background, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  imageText: { fontSize: 36 },
  name: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: APP_COLORS.text, textAlign: 'center' },
  price: { fontSize: FONT_SIZES.md, fontWeight: '700', color: APP_COLORS.primary, marginTop: 4 },
  gymiles: { fontSize: FONT_SIZES.xs, color: APP_COLORS.accent, marginTop: 2 },
});
