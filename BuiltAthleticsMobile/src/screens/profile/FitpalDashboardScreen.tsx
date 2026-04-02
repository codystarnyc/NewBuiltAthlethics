import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/useAuthStore';
import { useFoodStore } from '../../store/useFoodStore';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';

export default function FitpalDashboardScreen() {
  const user = useAuthStore((s) => s.user);
  const totals = useFoodStore((s) => s.dailyTotals);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.greeting}>Hello, {user?.name ?? 'Athlete'}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily Summary</Text>
          <View style={styles.statsRow}>
            <StatItem label="Calories" value={`${Math.round(totals.calories)}`} color={APP_COLORS.primary} />
            <StatItem label="Protein" value={`${Math.round(totals.protein)}g`} color={APP_COLORS.accent} />
            <StatItem label="Carbs" value={`${Math.round(totals.carbs)}g`} color={APP_COLORS.success} />
            <StatItem label="Fat" value={`${Math.round(totals.fat)}g`} color={APP_COLORS.warning} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly Progress</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.placeholderText}>Chart coming soon</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Activity Streak</Text>
          <Text style={styles.streakValue}>0 days</Text>
          <Text style={styles.streakSub}>Keep logging to build your streak!</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={statStyles.item}>
      <Text style={[statStyles.value, { color }]}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  item: { flex: 1, alignItems: 'center' },
  value: { fontSize: FONT_SIZES.lg, fontWeight: '700' },
  label: { fontSize: FONT_SIZES.xs, color: APP_COLORS.textSecondary, marginTop: 2 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  scroll: { padding: SPACING.lg },
  greeting: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.text, marginBottom: SPACING.lg },
  card: { backgroundColor: APP_COLORS.surface, borderRadius: 14, padding: SPACING.lg, marginBottom: SPACING.md },
  cardTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: APP_COLORS.text, marginBottom: SPACING.md },
  statsRow: { flexDirection: 'row' },
  chartPlaceholder: { height: 120, backgroundColor: APP_COLORS.background, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  placeholderText: { fontSize: FONT_SIZES.md, color: APP_COLORS.textLight },
  streakValue: { fontSize: FONT_SIZES.xxl, fontWeight: '800', color: APP_COLORS.primary },
  streakSub: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, marginTop: 4 },
});
