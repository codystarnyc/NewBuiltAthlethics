import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';

export default function AddRoutineScreen({ navigation }: { navigation: { goBack: () => void } }) {
  const [name, setName] = useState('');
  const [exercises, setExercises] = useState<string[]>([]);
  const [newExercise, setNewExercise] = useState('');

  function addExercise() {
    if (!newExercise.trim()) return;
    setExercises((prev) => [...prev, newExercise.trim()]);
    setNewExercise('');
  }

  function handleSave() {
    if (!name.trim()) return Alert.alert('Error', 'Routine name is required');
    if (exercises.length === 0) return Alert.alert('Error', 'Add at least one exercise');
    Alert.alert('Success', 'Routine saved');
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>New Routine</Text>

        <Text style={styles.label}>Routine Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Push Day" placeholderTextColor={APP_COLORS.textLight} />

        <Text style={styles.label}>Exercises</Text>
        {exercises.map((ex, i) => (
          <View key={i} style={styles.exerciseRow}>
            <Text style={styles.exerciseNum}>{i + 1}.</Text>
            <Text style={styles.exerciseName}>{ex}</Text>
          </View>
        ))}

        <View style={styles.addRow}>
          <TextInput style={[styles.input, styles.flex]} value={newExercise} onChangeText={setNewExercise} placeholder="Exercise name" placeholderTextColor={APP_COLORS.textLight} />
          <TouchableOpacity style={styles.addBtn} onPress={addExercise}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Routine</Text>
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
  input: { backgroundColor: APP_COLORS.surface, borderWidth: 1, borderColor: APP_COLORS.border, borderRadius: 10, paddingHorizontal: SPACING.md, paddingVertical: 12, fontSize: FONT_SIZES.md, color: APP_COLORS.text },
  flex: { flex: 1 },
  addRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: SPACING.sm },
  addBtn: { width: 44, height: 44, backgroundColor: APP_COLORS.accent, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  addBtnText: { color: '#fff', fontSize: 22, fontWeight: '700' },
  exerciseRow: { flexDirection: 'row', gap: 8, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: APP_COLORS.border },
  exerciseNum: { fontSize: FONT_SIZES.md, fontWeight: '700', color: APP_COLORS.primary },
  exerciseName: { fontSize: FONT_SIZES.md, color: APP_COLORS.text },
  button: { backgroundColor: APP_COLORS.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: SPACING.xl },
  buttonText: { color: '#fff', fontSize: FONT_SIZES.lg, fontWeight: '700' },
});
