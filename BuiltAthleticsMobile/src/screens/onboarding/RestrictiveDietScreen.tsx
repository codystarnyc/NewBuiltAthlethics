import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { OnboardingScreenProps } from '../../navigation/types';

const RESTRICTIONS = ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'Nut-Free', 'Halal', 'Kosher'];

export default function RestrictiveDietScreen({ navigation }: OnboardingScreenProps<'RestrictiveDiet'>) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(item: string) {
    if (item === 'None') { setSelected(['None']); return; }
    setSelected((prev) => {
      const without = prev.filter((s) => s !== 'None');
      return without.includes(item) ? without.filter((s) => s !== item) : [...without, item];
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.step}>Step 8 of 9</Text>
        <Text style={styles.title}>Dietary Restrictions</Text>
        <Text style={styles.subtitle}>Select any that apply</Text>
        <View style={styles.chipRow}>
          {RESTRICTIONS.map((r) => (
            <TouchableOpacity key={r} style={[styles.chip, selected.includes(r) && styles.chipActive]} onPress={() => toggle(r)}>
              <Text style={[styles.chipText, selected.includes(r) && styles.chipTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity style={[styles.button, selected.length === 0 && styles.buttonDisabled]} disabled={selected.length === 0} onPress={() => navigation.navigate('CreatePlan')}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background, padding: SPACING.lg },
  scroll: { flexGrow: 1, justifyContent: 'center' },
  step: { fontSize: FONT_SIZES.sm, color: APP_COLORS.textSecondary, marginBottom: 4 },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, marginBottom: SPACING.xl },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { borderWidth: 1.5, borderColor: APP_COLORS.border, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: APP_COLORS.surface },
  chipActive: { backgroundColor: APP_COLORS.primary, borderColor: APP_COLORS.primary },
  chipText: { fontSize: FONT_SIZES.md, color: APP_COLORS.text },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  button: { backgroundColor: APP_COLORS.primary, borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontSize: FONT_SIZES.lg, fontWeight: '700' },
});
