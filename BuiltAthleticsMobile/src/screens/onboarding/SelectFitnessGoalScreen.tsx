import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { OnboardingScreenProps } from '../../navigation/types';

const GOALS = [
  { id: 'lose', label: 'Lose Weight', desc: 'Burn fat and get lean' },
  { id: 'maintain', label: 'Maintain Weight', desc: 'Stay at your current weight' },
  { id: 'gain', label: 'Build Muscle', desc: 'Gain mass and strength' },
  { id: 'tone', label: 'Tone & Define', desc: 'Sculpt and define muscles' },
];

export default function SelectFitnessGoalScreen({ navigation }: OnboardingScreenProps<'SelectFitnessGoal'>) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.step}>Step 7 of 9</Text>
        <Text style={styles.title}>Fitness Goal</Text>
        <Text style={styles.subtitle}>What's your primary fitness objective?</Text>
        <View style={styles.options}>
          {GOALS.map((g) => (
            <TouchableOpacity key={g.id} style={[styles.option, selected === g.id && styles.optionActive]} onPress={() => setSelected(g.id)}>
              <Text style={[styles.optionLabel, selected === g.id && styles.optionLabelActive]}>{g.label}</Text>
              <Text style={styles.optionDesc}>{g.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <TouchableOpacity style={[styles.button, !selected && styles.buttonDisabled]} disabled={!selected} onPress={() => navigation.navigate('FitCoach')}>
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
  options: { gap: SPACING.sm },
  option: { backgroundColor: APP_COLORS.surface, borderWidth: 2, borderColor: APP_COLORS.border, borderRadius: 14, padding: SPACING.lg },
  optionActive: { borderColor: APP_COLORS.primary, backgroundColor: APP_COLORS.primary + '10' },
  optionLabel: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: APP_COLORS.text },
  optionLabelActive: { color: APP_COLORS.primary },
  optionDesc: { fontSize: FONT_SIZES.sm, color: APP_COLORS.textSecondary, marginTop: 2 },
  button: { backgroundColor: APP_COLORS.primary, borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontSize: FONT_SIZES.lg, fontWeight: '700' },
});
