import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/useAuthStore';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';

const STEPS = ['Analyzing your profile...', 'Building workout plan...', 'Generating meal plan...', 'Finalizing...'];

export default function CreatePlanScreen() {
  const [stepIndex, setStepIndex] = useState(0);
  const setOnboardingComplete = useAuthStore((s) => s.setOnboardingComplete);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(() => setOnboardingComplete(), 500);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [setOnboardingComplete]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={APP_COLORS.primary} style={styles.spinner} />
        <Text style={styles.title}>Creating Your Plan</Text>
        <Text style={styles.step}>{STEPS[stepIndex]}</Text>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((stepIndex + 1) / STEPS.length) * 100}%` }]} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg },
  spinner: { marginBottom: SPACING.lg },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.text, marginBottom: 8 },
  step: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, marginBottom: SPACING.xl },
  progressBar: { width: '80%', height: 6, backgroundColor: APP_COLORS.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: APP_COLORS.primary, borderRadius: 3 },
});
