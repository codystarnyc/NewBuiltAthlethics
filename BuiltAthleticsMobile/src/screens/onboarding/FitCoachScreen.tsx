import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { OnboardingScreenProps } from '../../navigation/types';

export default function FitCoachScreen({ navigation }: OnboardingScreenProps<'FitCoach'>) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}><Text style={styles.icon}>AI</Text></View>
        <Text style={styles.title}>Your AI Fit Coach</Text>
        <Text style={styles.subtitle}>Built Athletics uses AI to create personalized workout and meal plans tailored to your goals, body type, and schedule.</Text>

        <View style={styles.features}>
          {['Smart meal plans based on your macros', 'AI food recognition from photos', 'Adaptive workout recommendations', 'Progress tracking and insights'].map((f) => (
            <View key={f} style={styles.featureRow}>
              <View style={styles.dot} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RestrictiveDiet')}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background, padding: SPACING.lg },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: APP_COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  icon: { color: '#fff', fontSize: 28, fontWeight: '800' },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.text, marginBottom: 8 },
  subtitle: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.xl, lineHeight: 22 },
  features: { alignSelf: 'stretch' },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: APP_COLORS.accent, marginRight: 12 },
  featureText: { fontSize: FONT_SIZES.md, color: APP_COLORS.text },
  button: { backgroundColor: APP_COLORS.primary, borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: FONT_SIZES.lg, fontWeight: '700' },
});
