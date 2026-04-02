import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';

export default function CheckoutScreen({ navigation }: { navigation: { goBack: () => void } }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Checkout</Text>
        <Text style={styles.subtitle}>Complete your order</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Summary</Text>
          <Text style={styles.placeholder}>No items in cart</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Order Placed', 'Thank you for your purchase!', [{ text: 'OK', onPress: () => navigation.goBack() }])}>
          <Text style={styles.buttonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  content: { flex: 1, padding: SPACING.lg },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.text },
  subtitle: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, marginBottom: SPACING.lg },
  card: { backgroundColor: APP_COLORS.surface, borderRadius: 14, padding: SPACING.lg, marginBottom: SPACING.xl },
  cardTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: APP_COLORS.text, marginBottom: SPACING.sm },
  placeholder: { fontSize: FONT_SIZES.md, color: APP_COLORS.textLight },
  button: { backgroundColor: APP_COLORS.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 'auto' },
  buttonText: { color: '#fff', fontSize: FONT_SIZES.lg, fontWeight: '700' },
});
