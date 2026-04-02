import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { OnboardingScreenProps } from '../../navigation/types';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function SelectRoutineDaysScreen({ navigation }: OnboardingScreenProps<'SelectRoutineDays'>) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(day: string) {
    setSelected((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.step}>Step 6 of 9</Text>
        <Text style={styles.title}>Workout Days</Text>
        <Text style={styles.subtitle}>Which days do you prefer to work out?</Text>
        <View style={styles.daysRow}>
          {DAYS.map((day) => (
            <TouchableOpacity key={day} style={[styles.day, selected.includes(day) && styles.dayActive]} onPress={() => toggle(day)}>
              <Text style={[styles.dayText, selected.includes(day) && styles.dayTextActive]}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.count}>{selected.length} days selected</Text>
      </View>
      <TouchableOpacity style={[styles.button, selected.length === 0 && styles.buttonDisabled]} disabled={selected.length === 0} onPress={() => navigation.navigate('SelectFitnessGoal')}>
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
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  day: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: APP_COLORS.border, alignItems: 'center', justifyContent: 'center', backgroundColor: APP_COLORS.surface },
  dayActive: { borderColor: APP_COLORS.primary, backgroundColor: APP_COLORS.primary },
  dayText: { fontSize: FONT_SIZES.xs, fontWeight: '700', color: APP_COLORS.text },
  dayTextActive: { color: '#fff' },
  count: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, textAlign: 'center' },
  button: { backgroundColor: APP_COLORS.primary, borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontSize: FONT_SIZES.lg, fontWeight: '700' },
});
