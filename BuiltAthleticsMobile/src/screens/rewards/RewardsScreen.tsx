import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/useAuthStore';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { RewardsScreenProps } from '../../navigation/types';

export default function RewardsScreen({ navigation }: RewardsScreenProps<'Rewards'>) {
  const gymiles = useAuthStore((s) => s.user?.gymiles ?? 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Rewards</Text>

        <View style={styles.pointsCard}>
          <Text style={styles.pointsLabel}>Your GYMILES</Text>
          <Text style={styles.pointsValue}>{gymiles}</Text>
          <Text style={styles.pointsHint}>Earn points by completing workouts and logging food</Text>
        </View>

        <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('ProductListing', {})}>
          <Text style={styles.shopButtonText}>Browse Products</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ordersButton} onPress={() => navigation.navigate('Orders')}>
          <Text style={styles.ordersText}>View Order History</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  scroll: { padding: SPACING.lg },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.text, marginBottom: SPACING.lg },
  pointsCard: { backgroundColor: APP_COLORS.primary, borderRadius: 16, padding: SPACING.lg, alignItems: 'center', marginBottom: SPACING.lg },
  pointsLabel: { fontSize: FONT_SIZES.md, color: 'rgba(255,255,255,0.7)' },
  pointsValue: { fontSize: 48, fontWeight: '900', color: '#fff', marginVertical: 4 },
  pointsHint: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
  shopButton: { backgroundColor: APP_COLORS.accent, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: SPACING.sm },
  shopButtonText: { color: '#fff', fontSize: FONT_SIZES.lg, fontWeight: '700' },
  ordersButton: { borderWidth: 1, borderColor: APP_COLORS.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  ordersText: { fontSize: FONT_SIZES.md, fontWeight: '600', color: APP_COLORS.primary },
});
