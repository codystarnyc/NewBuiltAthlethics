import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { RewardsScreenProps } from '../../navigation/types';

export default function CartScreen({ navigation }: RewardsScreenProps<'Cart'>) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.title}>Your Cart is Empty</Text>
        <Text style={styles.subtitle}>Browse products to add items to your cart</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ProductListing', {})}>
          <Text style={styles.buttonText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg },
  emptyIcon: { fontSize: 56, marginBottom: SPACING.md },
  title: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: APP_COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, marginBottom: SPACING.xl },
  button: { backgroundColor: APP_COLORS.primary, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 32 },
  buttonText: { color: '#fff', fontSize: FONT_SIZES.md, fontWeight: '700' },
});
