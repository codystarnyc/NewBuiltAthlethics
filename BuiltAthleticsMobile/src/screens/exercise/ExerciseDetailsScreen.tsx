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
import type { ExerciseScreenProps } from '../../navigation/types';
import type { WorkoutSet } from '../../api/types';

export default function ExerciseDetailsScreen({ route }: ExerciseScreenProps<'ExerciseDetails'>) {
  const { exerciseId, exerciseName } = route.params;
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  function addSet() {
    if (!reps) return Alert.alert('Error', 'Enter reps');
    setSets((prev) => [...prev, { reps: parseInt(reps, 10), weight: parseFloat(weight) || 0 }]);
    setReps('');
    setWeight('');
  }

  function removeSet(index: number) {
    setSets((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.name}>{exerciseName ?? 'Exercise'}</Text>

        <View style={styles.inputRow}>
          <View style={styles.inputField}>
            <Text style={styles.label}>Weight (lbs)</Text>
            <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="numeric" placeholder="0" placeholderTextColor={APP_COLORS.textLight} />
          </View>
          <View style={styles.inputField}>
            <Text style={styles.label}>Reps</Text>
            <TextInput style={styles.input} value={reps} onChangeText={setReps} keyboardType="numeric" placeholder="0" placeholderTextColor={APP_COLORS.textLight} />
          </View>
          <TouchableOpacity style={styles.addSetButton} onPress={addSet}>
            <Text style={styles.addSetText}>+</Text>
          </TouchableOpacity>
        </View>

        {sets.length > 0 && (
          <View style={styles.setsCard}>
            <View style={styles.setHeader}>
              <Text style={styles.setHeaderText}>Set</Text>
              <Text style={styles.setHeaderText}>Weight</Text>
              <Text style={styles.setHeaderText}>Reps</Text>
              <Text style={styles.setHeaderText} />
            </View>
            {sets.map((set, index) => (
              <View key={index} style={styles.setRow}>
                <Text style={styles.setText}>{index + 1}</Text>
                <Text style={styles.setText}>{set.weight} lbs</Text>
                <Text style={styles.setText}>{set.reps}</Text>
                <TouchableOpacity onPress={() => removeSet(index)}>
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {sets.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No sets logged yet</Text>
            <Text style={styles.emptyHint}>Enter weight and reps above to log a set</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  scroll: { padding: SPACING.lg },
  name: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.text, marginBottom: SPACING.lg },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: SPACING.sm, marginBottom: SPACING.lg },
  inputField: { flex: 1 },
  label: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: APP_COLORS.text, marginBottom: 4 },
  input: {
    backgroundColor: APP_COLORS.surface,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    borderRadius: 10,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    fontSize: FONT_SIZES.lg,
    color: APP_COLORS.text,
    textAlign: 'center',
  },
  addSetButton: {
    width: 48,
    height: 48,
    backgroundColor: APP_COLORS.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSetText: { color: '#fff', fontSize: 24, fontWeight: '700' },
  setsCard: { backgroundColor: APP_COLORS.surface, borderRadius: 14, padding: SPACING.md },
  setHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: APP_COLORS.border },
  setHeaderText: { flex: 1, fontSize: FONT_SIZES.xs, fontWeight: '700', color: APP_COLORS.textSecondary, textAlign: 'center' },
  setRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: APP_COLORS.border },
  setText: { flex: 1, fontSize: FONT_SIZES.md, color: APP_COLORS.text, textAlign: 'center' },
  removeText: { color: APP_COLORS.error, fontSize: FONT_SIZES.md, fontWeight: '700', paddingHorizontal: 8 },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: APP_COLORS.text },
  emptyHint: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, marginTop: 4 },
});
