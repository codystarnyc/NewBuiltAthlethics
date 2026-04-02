import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { OnboardingScreenProps } from '../../navigation/types';

export default function SelectWeightScreen({ navigation }: OnboardingScreenProps<'SelectWeight'>) {
  const [weight, setWeight] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.step}>Step 3 of 9</Text>
        <Text style={styles.title}>Current Weight</Text>
        <Text style={styles.subtitle}>For calorie and BMI calculations</Text>
        <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="decimal-pad" placeholder="150" placeholderTextColor={APP_COLORS.textLight} />
        <Text style={styles.unit}>lbs</Text>
      </View>
      <TouchableOpacity style={[styles.button, !weight && styles.buttonDisabled]} disabled={!weight} onPress={() => navigation.navigate('SelectHeight')}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background, padding: SPACING.lg },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  step: { fontSize: FONT_SIZES.sm, color: APP_COLORS.textSecondary, marginBottom: 4, alignSelf: 'flex-start' },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.text, marginBottom: 4, alignSelf: 'flex-start' },
  subtitle: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, marginBottom: SPACING.xl, alignSelf: 'flex-start' },
  input: { fontSize: 56, fontWeight: '800', color: APP_COLORS.primary, textAlign: 'center', width: '60%', borderBottomWidth: 3, borderBottomColor: APP_COLORS.primary, paddingVertical: 8 },
  unit: { fontSize: FONT_SIZES.xl, color: APP_COLORS.textSecondary, marginTop: 8 },
  button: { backgroundColor: APP_COLORS.primary, borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontSize: FONT_SIZES.lg, fontWeight: '700' },
});
