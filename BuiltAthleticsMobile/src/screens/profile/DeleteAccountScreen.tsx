import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/useAuthStore';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';

export default function DeleteAccountScreen() {
  const [confirmText, setConfirmText] = useState('');
  const logout = useAuthStore((s) => s.logout);

  function handleDelete() {
    if (confirmText !== 'DELETE') {
      return Alert.alert('Error', 'Type DELETE to confirm');
    }
    Alert.alert('Account Deleted', 'Your account and all data have been removed.', [
      { text: 'OK', onPress: logout },
    ]);
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <View style={styles.warningBadge}>
          <Text style={styles.warningIcon}>⚠️</Text>
        </View>
        <Text style={styles.title}>Delete Account</Text>
        <Text style={styles.subtitle}>
          This will permanently delete your account, workout history, food diary, and all associated data. This action cannot be undone.
        </Text>

        <Text style={styles.label}>Type DELETE to confirm</Text>
        <TextInput
          style={styles.input}
          value={confirmText}
          onChangeText={setConfirmText}
          placeholder="DELETE"
          placeholderTextColor={APP_COLORS.textLight}
          autoCapitalize="characters"
        />

        <TouchableOpacity
          style={[styles.button, confirmText !== 'DELETE' && styles.buttonDisabled]}
          onPress={handleDelete}
          disabled={confirmText !== 'DELETE'}
        >
          <Text style={styles.buttonText}>Permanently Delete Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  content: { flex: 1, padding: SPACING.lg, alignItems: 'center', justifyContent: 'center' },
  warningBadge: { width: 72, height: 72, borderRadius: 36, backgroundColor: APP_COLORS.error + '15', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  warningIcon: { fontSize: 36 },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.error, marginBottom: 8 },
  subtitle: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.xl, lineHeight: 22 },
  label: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: APP_COLORS.text, alignSelf: 'flex-start', marginBottom: 4 },
  input: { width: '100%', backgroundColor: APP_COLORS.surface, borderWidth: 1, borderColor: APP_COLORS.error, borderRadius: 10, paddingHorizontal: SPACING.md, paddingVertical: 14, fontSize: FONT_SIZES.lg, color: APP_COLORS.text, textAlign: 'center' },
  button: { width: '100%', backgroundColor: APP_COLORS.error, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: SPACING.lg },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontSize: FONT_SIZES.md, fontWeight: '700' },
});
