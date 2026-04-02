import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';

export default function OrdersScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.title}>No Orders Yet</Text>
        <Text style={styles.subtitle}>Your order history will appear here after your first purchase</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg },
  emptyIcon: { fontSize: 56, marginBottom: SPACING.md },
  title: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: APP_COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, textAlign: 'center' },
});
