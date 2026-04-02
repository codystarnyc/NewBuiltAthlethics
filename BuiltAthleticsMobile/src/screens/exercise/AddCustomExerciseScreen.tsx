import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';

export default function AddCustomExerciseScreen({ navigation }: { navigation: { goBack: () => void } }) {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  function handleSave() {
    if (!name.trim()) return Alert.alert('Error', 'Exercise name is required');
    Alert.alert('Success', 'Custom exercise created');
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>New Custom Exercise</Text>

        <Text style={styles.label}>Exercise Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Incline Dumbbell Press" placeholderTextColor={APP_COLORS.textLight} />

        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Any form tips or notes..."
          placeholderTextColor={APP_COLORS.textLight}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Exercise</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  scroll: { padding: SPACING.lg },
  heading: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.text, marginBottom: SPACING.lg },
  label: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: APP_COLORS.text, marginBottom: 4, marginTop: SPACING.md },
  input: {
    backgroundColor: APP_COLORS.surface,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    borderRadius: 10,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    fontSize: FONT_SIZES.md,
    color: APP_COLORS.text,
  },
  multiline: { minHeight: 100, paddingTop: 12 },
  button: { backgroundColor: APP_COLORS.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: SPACING.xl },
  buttonText: { color: '#fff', fontSize: FONT_SIZES.lg, fontWeight: '700' },
});
