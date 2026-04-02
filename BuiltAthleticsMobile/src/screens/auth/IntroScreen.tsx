import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { AuthScreenProps } from '../../navigation/types';

export default function IntroScreen({ navigation }: AuthScreenProps<'Intro'>) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>BA</Text>
        </View>
        <Text style={styles.appName}>Built Athletics</Text>
        <Text style={styles.tagline}>Train smarter. Eat better. Look your best.</Text>

        <View style={styles.features}>
          {['AI Food Recognition', 'Smart Meal Plans', 'Workout Tracking', 'Body Analysis'].map((f) => (
            <View key={f} style={styles.featureRow}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.primaryText}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.secondaryText}>I already have an account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg },
  logoCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: APP_COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  logoText: { color: '#fff', fontSize: 36, fontWeight: '800', letterSpacing: 1 },
  appName: { fontSize: 32, fontWeight: '800', color: APP_COLORS.primary, marginBottom: 4 },
  tagline: { fontSize: FONT_SIZES.lg, color: APP_COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.xl },
  features: { alignSelf: 'stretch', paddingHorizontal: SPACING.xl },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  featureDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: APP_COLORS.accent, marginRight: 12 },
  featureText: { fontSize: FONT_SIZES.lg, color: APP_COLORS.text },
  buttons: { padding: SPACING.lg },
  primaryButton: { backgroundColor: APP_COLORS.primary, borderRadius: 14, paddingVertical: 18, alignItems: 'center', marginBottom: SPACING.sm },
  primaryText: { color: '#fff', fontSize: FONT_SIZES.lg, fontWeight: '700' },
  secondaryButton: { paddingVertical: 14, alignItems: 'center' },
  secondaryText: { fontSize: FONT_SIZES.md, color: APP_COLORS.primaryLight, fontWeight: '600' },
});
