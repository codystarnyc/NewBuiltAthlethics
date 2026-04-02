import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { OnboardingScreenProps } from '../../navigation/types';

const GENDERS = [
  { id: 'male', label: 'Male', icon: '♂️' },
  { id: 'female', label: 'Female', icon: '♀️' },
  { id: 'other', label: 'Other', icon: '⚧️' },
];

export default function SelectGenderScreen({ navigation }: OnboardingScreenProps<'SelectGender'>) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.step}>Step 1 of 9</Text>
        <Text style={styles.title}>Select Your Gender</Text>
        <Text style={styles.subtitle}>For personalized fitness recommendations</Text>
        <View style={styles.options}>
          {GENDERS.map((g) => (
            <TouchableOpacity key={g.id} style={[styles.option, selected === g.id && styles.optionActive]} onPress={() => setSelected(g.id)}>
              <Text style={styles.optionIcon}>{g.icon}</Text>
              <Text style={[styles.optionText, selected === g.id && styles.optionTextActive]}>{g.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <TouchableOpacity style={[styles.button, !selected && styles.buttonDisabled]} disabled={!selected} onPress={() => navigation.navigate('SetName')}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background, padding: SPACING.lg },
  content: { flex: 1, justifyContent: 'center' },
  step: { fontSize: FONT_SIZES.sm, color: APP_COLORS.textSecondary, marginBottom: 4 },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, marginBottom: SPACING.xl },
  options: { gap: SPACING.md },
  option: { flexDirection: 'row', alignItems: 'center', backgroundColor: APP_COLORS.surface, borderWidth: 2, borderColor: APP_COLORS.border, borderRadius: 14, padding: SPACING.lg, gap: 12 },
  optionActive: { borderColor: APP_COLORS.primary, backgroundColor: APP_COLORS.primary + '10' },
  optionIcon: { fontSize: 28 },
  optionText: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: APP_COLORS.text },
  optionTextActive: { color: APP_COLORS.primary },
  button: { backgroundColor: APP_COLORS.primary, borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontSize: FONT_SIZES.lg, fontWeight: '700' },
});
