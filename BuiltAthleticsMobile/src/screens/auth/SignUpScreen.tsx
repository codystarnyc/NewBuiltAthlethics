import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/useAuthStore';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { AuthScreenProps } from '../../navigation/types';

export default function SignUpScreen({ navigation }: AuthScreenProps<'SignUp'>) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const signUp = useAuthStore((s) => s.signUp);
  const isLoading = useAuthStore((s) => s.isLoading);

  async function handleSignUp() {
    if (!name.trim()) return Alert.alert('Error', 'Please enter your name');
    if (!email.trim()) return Alert.alert('Error', 'Please enter your email');
    if (password.length < 6) return Alert.alert('Error', 'Password must be at least 6 characters');
    if (password !== confirmPassword) return Alert.alert('Error', 'Passwords do not match');

    try {
      await signUp({ name: name.trim(), email: email.trim().toLowerCase(), password });
    } catch {
      Alert.alert('Sign Up Failed', 'Could not create your account. Please try again.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start your fitness journey today</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="John Doe"
              placeholderTextColor={APP_COLORS.textLight}
              autoCapitalize="words"
              textContentType="name"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={APP_COLORS.textLight}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="At least 6 characters"
              placeholderTextColor={APP_COLORS.textLight}
              secureTextEntry
              textContentType="newPassword"
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter your password"
              placeholderTextColor={APP_COLORS.textLight}
              secureTextEntry
              textContentType="newPassword"
            />

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, padding: SPACING.lg },
  header: { marginTop: 24, marginBottom: 32 },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.primary },
  subtitle: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, marginTop: 4 },
  form: { width: '100%' },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: APP_COLORS.text,
    marginBottom: 6,
    marginTop: SPACING.md,
  },
  input: {
    backgroundColor: APP_COLORS.surface,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    fontSize: FONT_SIZES.md,
    color: APP_COLORS.text,
  },
  button: {
    backgroundColor: APP_COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: FONT_SIZES.lg, fontWeight: '700' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingBottom: SPACING.lg,
  },
  footerText: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary },
  footerLink: { fontSize: FONT_SIZES.md, color: APP_COLORS.primary, fontWeight: '600' },
});
