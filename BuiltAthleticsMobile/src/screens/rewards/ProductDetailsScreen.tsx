import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { RewardsScreenProps } from '../../navigation/types';

export default function ProductDetailsScreen({ route, navigation }: RewardsScreenProps<'ProductDetails'>) {
  const { productId } = route.params;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.imagePlaceholder}><Text style={styles.imageText}>🛍️</Text></View>
        <Text style={styles.name}>Product {productId}</Text>
        <Text style={styles.price}>$29.99</Text>
        <Text style={styles.description}>High-quality athletic product from Built Athletics. Designed for performance and comfort.</Text>

        <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.cartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  scroll: { padding: SPACING.lg },
  imagePlaceholder: { width: '100%', height: 200, backgroundColor: APP_COLORS.surface, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg },
  imageText: { fontSize: 64 },
  name: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.text },
  price: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: APP_COLORS.primary, marginTop: 4, marginBottom: SPACING.md },
  description: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, lineHeight: 22, marginBottom: SPACING.xl },
  cartButton: { backgroundColor: APP_COLORS.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  cartButtonText: { color: '#fff', fontSize: FONT_SIZES.lg, fontWeight: '700' },
});
