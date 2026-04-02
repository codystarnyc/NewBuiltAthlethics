import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { ExerciseScreenProps } from '../../navigation/types';

export default function GymCompletionScreen({ navigation }: ExerciseScreenProps<'GymCompletion'>) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeIcon}>🏆</Text>
        </View>
        <Text style={styles.title}>Workout Complete!</Text>
        <Text style={styles.subtitle}>Great job crushing your session today</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Sets</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('GymDiary')}>
          <Text style={styles.buttonText}>Back to Diary</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg },
  badge: { width: 100, height: 100, borderRadius: 50, backgroundColor: APP_COLORS.warning + '20', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg },
  badgeIcon: { fontSize: 48 },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.text, marginBottom: 8 },
  subtitle: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, marginBottom: SPACING.xl },
  statsRow: { flexDirection: 'row', backgroundColor: APP_COLORS.surface, borderRadius: 14, padding: SPACING.lg, marginBottom: SPACING.xl },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FONT_SIZES.xxl, fontWeight: '800', color: APP_COLORS.primary },
  statLabel: { fontSize: FONT_SIZES.sm, color: APP_COLORS.textSecondary, marginTop: 4 },
  statDivider: { width: 1, backgroundColor: APP_COLORS.border },
  button: { backgroundColor: APP_COLORS.primary, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 48 },
  buttonText: { color: '#fff', fontSize: FONT_SIZES.lg, fontWeight: '700' },
});
