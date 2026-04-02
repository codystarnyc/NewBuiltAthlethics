import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';

const MEASUREMENTS = [
  { label: 'Weight', value: '—', unit: 'lbs' },
  { label: 'Body Fat', value: '—', unit: '%' },
  { label: 'Chest', value: '—', unit: 'in' },
  { label: 'Waist', value: '—', unit: 'in' },
  { label: 'Hips', value: '—', unit: 'in' },
  { label: 'Arms', value: '—', unit: 'in' },
  { label: 'Thighs', value: '—', unit: 'in' },
];

export default function BodyMeasurementsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          {MEASUREMENTS.map((m) => (
            <View key={m.label} style={styles.row}>
              <Text style={styles.label}>{m.label}</Text>
              <Text style={styles.value}>{m.value} {m.unit}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Update Measurements</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  scroll: { padding: SPACING.lg },
  card: { backgroundColor: APP_COLORS.surface, borderRadius: 14, padding: SPACING.lg, marginBottom: SPACING.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: APP_COLORS.border },
  label: { fontSize: FONT_SIZES.md, color: APP_COLORS.text },
  value: { fontSize: FONT_SIZES.md, fontWeight: '600', color: APP_COLORS.primary },
  button: { backgroundColor: APP_COLORS.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: FONT_SIZES.md, fontWeight: '700' },
});
