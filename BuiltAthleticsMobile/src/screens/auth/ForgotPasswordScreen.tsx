import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';

export default function ForgotPasswordScreen({ navigation }: { navigation: { goBack: () => void } }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    if (!email.trim()) return Alert.alert('Error', 'Please enter your email');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.center}>
          <View style={styles.successIcon}><Text style={styles.successEmoji}>✓</Text></View>
          <Text style={styles.title}>Email Sent</Text>
          <Text style={styles.subtitle}>Check {email} for a password reset link</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter the email address associated with your account</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={APP_COLORS.textLight}
          keyboardType="email-address"
          autoCapitalize="none"
          autoFocus
        />

        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send Reset Link</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  content: { flex: 1, padding: SPACING.lg, justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg },
  successIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: APP_COLORS.success + '20', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  successEmoji: { fontSize: 32, color: APP_COLORS.success },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.text, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.xl },
  label: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: APP_COLORS.text, marginBottom: 4 },
  input: { backgroundColor: APP_COLORS.surface, borderWidth: 1, borderColor: APP_COLORS.border, borderRadius: 12, paddingHorizontal: SPACING.md, paddingVertical: 14, fontSize: FONT_SIZES.md, color: APP_COLORS.text },
  button: { backgroundColor: APP_COLORS.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: SPACING.lg },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: FONT_SIZES.lg, fontWeight: '700' },
});
