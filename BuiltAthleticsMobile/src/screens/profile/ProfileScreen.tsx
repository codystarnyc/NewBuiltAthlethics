import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../../store/useAuthStore';
import { useFoodStore } from '../../store/useFoodStore';
import { useFuelTrackStore } from '../../store/useFuelTrackStore';
import * as userApi from '../../api/user';
import * as foodApi from '../../api/food';
import * as fueltrackApi from '../../api/fueltrack';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { ProfileScreenProps } from '../../navigation/types';
import type { User, FuelTrackDay } from '../../api/types';

function MacroRing({ label, value, target, color }: { label: string; value: number; target: number; color: string }) {
  const pct = target > 0 ? Math.min(value / target, 1) : 0;
  return (
    <View style={ringStyles.container}>
      <View style={[ringStyles.ring, { borderColor: APP_COLORS.border }]}>
        <View style={[ringStyles.fill, { borderColor: color, borderTopColor: pct > 0.25 ? color : 'transparent', borderRightColor: pct > 0.5 ? color : 'transparent', borderBottomColor: pct > 0.75 ? color : 'transparent' }]} />
        <Text style={ringStyles.value}>{Math.round(value)}</Text>
      </View>
      <Text style={ringStyles.label}>{label}</Text>
    </View>
  );
}

const ringStyles = StyleSheet.create({
  container: { alignItems: 'center', width: 70 },
  ring: { width: 56, height: 56, borderRadius: 28, borderWidth: 4, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  fill: { position: 'absolute', width: 56, height: 56, borderRadius: 28, borderWidth: 4 },
  value: { fontSize: FONT_SIZES.sm, fontWeight: '700', color: APP_COLORS.text },
  label: { fontSize: FONT_SIZES.xs, color: APP_COLORS.textSecondary, marginTop: 4 },
});

export default function ProfileScreen({ navigation }: ProfileScreenProps<'Profile'>) {
  const authUser = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const setUser = useAuthStore((s) => s.setUser);
  const setDiaryEntries = useFoodStore((s) => s.setDiaryEntries);
  const totals = useFoodStore((s) => s.dailyTotals);

  const setFuelHistory = useFuelTrackStore((s) => s.setHistory);
  const fuelHistory = useFuelTrackStore((s) => s.history);

  const [fullUser, setFullUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useFocusEffect(
    useCallback(() => {
      if (!authUser?.email) return;
      let cancelled = false;
      (async () => {
        try {
          setLoading(true);
          const [profile, diary, fuel] = await Promise.all([
            userApi.getUser(authUser.email),
            foodApi.getFoodDiary(authUser.email, today),
            fueltrackApi.getScoreHistory(authUser.email, 7).catch(() => []),
          ]);
          if (cancelled) return;
          setFullUser(profile);
          setUser({ id: profile.id, email: profile.email, name: profile.name });
          setDiaryEntries(Array.isArray(diary) ? diary : []);
          setFuelHistory(Array.isArray(fuel) ? fuel : []);
        } catch {
          // keep existing data
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
      return () => { cancelled = true; };
    }, [authUser?.email, today, setUser, setDiaryEntries, setFuelHistory]),
  );

  const weeklyAvg = fuelHistory.length > 0
    ? Math.round(fuelHistory.reduce((s, d) => s + d.overallScore, 0) / fuelHistory.length)
    : null;

  const user = fullUser ?? authUser;
  const calorieTarget = 2000;
  const proteinTarget = 150;
  const carbsTarget = 250;
  const fatTarget = 65;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name ?? 'Athlete'}</Text>
          <Text style={styles.email}>{user?.email ?? ''}</Text>
          {fullUser && (
            <View style={styles.statsRow}>
              {fullUser.weight ? <Text style={styles.statBadge}>{fullUser.weight} kg</Text> : null}
              {fullUser.height ? <Text style={styles.statBadge}>{fullUser.height} cm</Text> : null}
              {fullUser.fitnessGoal ? <Text style={styles.statBadge}>{fullUser.fitnessGoal}</Text> : null}
              {fullUser.gymiles ? <Text style={[styles.statBadge, { color: APP_COLORS.primary }]}>{fullUser.gymiles} Gymiles</Text> : null}
            </View>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={APP_COLORS.primary} />
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Today's Nutrition</Text>
            <View style={styles.calorieRow}>
              <Text style={styles.calorieValue}>{Math.round(totals.calories)}</Text>
              <Text style={styles.calorieLabel}> / {calorieTarget} kcal</Text>
            </View>
            <View style={styles.macroRow}>
              <MacroRing label="Protein" value={totals.protein} target={proteinTarget} color={APP_COLORS.primary} />
              <MacroRing label="Carbs" value={totals.carbs} target={carbsTarget} color={APP_COLORS.accent} />
              <MacroRing label="Fat" value={totals.fat} target={fatTarget} color={APP_COLORS.warning} />
            </View>
          </View>
        )}

        {weeklyAvg !== null && (
          <View style={styles.fuelCard}>
            <Text style={styles.fuelTitle}>FuelTrack Weekly</Text>
            <View style={styles.fuelRow}>
              <Text style={[
                styles.fuelValue,
                { color: weeklyAvg >= 70 ? APP_COLORS.success : weeklyAvg >= 40 ? APP_COLORS.warning : APP_COLORS.error },
              ]}>
                {weeklyAvg}
              </Text>
              <Text style={styles.fuelMax}>/ 100</Text>
            </View>
            <Text style={styles.fuelSub}>{fuelHistory.length}-day average score</Text>
          </View>
        )}

        <View style={styles.actions}>
          {[
            { title: 'Body Measurements', screen: 'BodyMeasurements' as const },
            { title: 'FitPal Dashboard', screen: 'FitpalDashboard' as const },
            { title: 'Log Weight', screen: 'AddWeight' as const },
            { title: 'Wearable Devices', screen: 'WearableList' as const },
            { title: 'Settings', screen: 'Settings' as const },
          ].map((item) => (
            <TouchableOpacity
              key={item.screen}
              style={styles.actionRow}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Text style={styles.actionText}>{item.title}</Text>
              <Text style={styles.actionArrow}>{'>'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  scroll: { padding: SPACING.lg },
  header: { alignItems: 'center', marginBottom: SPACING.lg },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: APP_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '700' },
  name: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: APP_COLORS.text },
  email: { fontSize: FONT_SIZES.sm, color: APP_COLORS.textSecondary, marginTop: 2 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: SPACING.sm, justifyContent: 'center' },
  statBadge: {
    fontSize: FONT_SIZES.xs,
    color: APP_COLORS.textSecondary,
    backgroundColor: APP_COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  loadingWrap: { paddingVertical: 40, alignItems: 'center' },
  card: {
    backgroundColor: APP_COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: APP_COLORS.text, marginBottom: SPACING.md },
  calorieRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: SPACING.md },
  calorieValue: { fontSize: 36, fontWeight: '800', color: APP_COLORS.primary },
  calorieLabel: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary },
  macroRow: { flexDirection: 'row', justifyContent: 'space-around' },
  actions: {
    backgroundColor: APP_COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.border,
  },
  actionText: { fontSize: FONT_SIZES.md, color: APP_COLORS.text },
  actionArrow: { fontSize: FONT_SIZES.lg, color: APP_COLORS.textLight },
  logoutButton: {
    borderWidth: 1,
    borderColor: APP_COLORS.error,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: { fontSize: FONT_SIZES.md, fontWeight: '600', color: APP_COLORS.error },
  fuelCard: {
    backgroundColor: APP_COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  fuelTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: APP_COLORS.text, marginBottom: SPACING.sm },
  fuelRow: { flexDirection: 'row', alignItems: 'baseline' },
  fuelValue: { fontSize: 36, fontWeight: '800' },
  fuelMax: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, marginLeft: 4 },
  fuelSub: { fontSize: FONT_SIZES.sm, color: APP_COLORS.textSecondary, marginTop: 4 },
});
