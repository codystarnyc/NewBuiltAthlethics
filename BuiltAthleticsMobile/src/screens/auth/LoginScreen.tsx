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

export default function LoginScreen({ navigation }: AuthScreenProps<'Login'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  async function handleLogin() {
    if (!email.trim()) return Alert.alert('Error', 'Please enter your email');
    if (!password) return Alert.alert('Error', 'Please enter your password');

    try {
      await login({ email: email.trim().toLowerCase(), password });
    } catch {
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
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
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>BA</Text>
            </View>
            <Text style={styles.appName}>Built Athletics</Text>
            <Text style={styles.tagline}>Train smarter. Eat better.</Text>
          </View>

          <View style={styles.form}>
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
              placeholder="Enter your password"
              placeholderTextColor={APP_COLORS.textLight}
              secureTextEntry
              textContentType="password"
            />

            <TouchableOpacity
              style={styles.forgotButton}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.footerLink}>Sign Up</Text>
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
  logoSection: { alignItems: 'center', marginTop: 48, marginBottom: 40 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: APP_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  logoText: { color: '#fff', fontSize: 28, fontWeight: '800', letterSpacing: 1 },
  appName: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.primary },
  tagline: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, marginTop: 4 },
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
  forgotButton: { alignSelf: 'flex-end', marginTop: SPACING.sm },
  forgotText: { fontSize: FONT_SIZES.sm, color: APP_COLORS.primaryLight },
  button: {
    backgroundColor: APP_COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: SPACING.lg,
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
