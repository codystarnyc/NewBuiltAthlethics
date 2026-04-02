import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { OnboardingScreenProps } from '../../navigation/types';

export default function SetNameScreen({ navigation }: OnboardingScreenProps<'SetName'>) {
  const [name, setName] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.step}>Step 2 of 9</Text>
        <Text style={styles.title}>What's Your Name?</Text>
        <Text style={styles.subtitle}>We'll personalize your experience</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter your name" placeholderTextColor={APP_COLORS.textLight} autoFocus />
      </View>
      <TouchableOpacity style={[styles.button, !name.trim() && styles.buttonDisabled]} disabled={!name.trim()} onPress={() => navigation.navigate('SelectWeight')}>
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
  input: { backgroundColor: APP_COLORS.surface, borderWidth: 1, borderColor: APP_COLORS.border, borderRadius: 12, paddingHorizontal: SPACING.md, paddingVertical: 16, fontSize: FONT_SIZES.xl, color: APP_COLORS.text, textAlign: 'center' },
  button: { backgroundColor: APP_COLORS.primary, borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontSize: FONT_SIZES.lg, fontWeight: '700' },
});
