import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { OnboardingScreenProps } from '../../navigation/types';

export default function SelectHeightScreen({ navigation }: OnboardingScreenProps<'SelectHeight'>) {
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.step}>Step 4 of 9</Text>
        <Text style={styles.title}>Your Height</Text>
        <Text style={styles.subtitle}>For BMI and calorie calculations</Text>
        <View style={styles.row}>
          <View style={styles.field}>
            <TextInput style={styles.input} value={feet} onChangeText={setFeet} keyboardType="number-pad" placeholder="5" placeholderTextColor={APP_COLORS.textLight} />
            <Text style={styles.unit}>ft</Text>
          </View>
          <View style={styles.field}>
            <TextInput style={styles.input} value={inches} onChangeText={setInches} keyboardType="number-pad" placeholder="10" placeholderTextColor={APP_COLORS.textLight} />
            <Text style={styles.unit}>in</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={[styles.button, !feet && styles.buttonDisabled]} disabled={!feet} onPress={() => navigation.navigate('SelectDOB')}>
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
  row: { flexDirection: 'row', gap: SPACING.lg, justifyContent: 'center' },
  field: { alignItems: 'center' },
  input: { fontSize: 48, fontWeight: '800', color: APP_COLORS.primary, textAlign: 'center', width: 100, borderBottomWidth: 3, borderBottomColor: APP_COLORS.primary, paddingVertical: 8 },
  unit: { fontSize: FONT_SIZES.lg, color: APP_COLORS.textSecondary, marginTop: 4 },
  button: { backgroundColor: APP_COLORS.primary, borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontSize: FONT_SIZES.lg, fontWeight: '700' },
});
