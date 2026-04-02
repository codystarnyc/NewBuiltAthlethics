import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCreateFood } from '../../hooks/useFoodDiary';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';

export default function CreateFoodScreen({ navigation }: { navigation: { goBack: () => void } }) {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [fiber, setFiber] = useState('');
  const [servingSize, setServingSize] = useState('1');
  const [servingUnit, setServingUnit] = useState('serving');

  const createMutation = useCreateFood();

  async function handleSave() {
    if (!name.trim()) return Alert.alert('Error', 'Food name is required');
    if (!calories) return Alert.alert('Error', 'Calories are required');

    createMutation.mutate(
      {
        name: name.trim(),
        brand: brand.trim() || undefined,
        calories: parseFloat(calories),
        protein: parseFloat(protein) || 0,
        carbs: parseFloat(carbs) || 0,
        fat: parseFloat(fat) || 0,
        fiber: parseFloat(fiber) || 0,
        servingSize,
        servingUnit,
      },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Food added to database');
          navigation.goBack();
        },
        onError: () => Alert.alert('Error', 'Could not save food. Please try again.'),
      },
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Add Custom Food</Text>

        <Text style={styles.label}>Food Name *</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Grilled Chicken Breast" placeholderTextColor={APP_COLORS.textLight} />

        <Text style={styles.label}>Brand (optional)</Text>
        <TextInput style={styles.input} value={brand} onChangeText={setBrand} placeholder="e.g. Tyson" placeholderTextColor={APP_COLORS.textLight} />

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Serving Size</Text>
            <TextInput style={styles.input} value={servingSize} onChangeText={setServingSize} keyboardType="numeric" />
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>Unit</Text>
            <TextInput style={styles.input} value={servingUnit} onChangeText={setServingUnit} placeholder="g, oz, cup" placeholderTextColor={APP_COLORS.textLight} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Nutrition per Serving</Text>

        <View style={styles.row}>
          <Field label="Calories *" value={calories} onChange={setCalories} />
          <Field label="Protein (g)" value={protein} onChange={setProtein} />
        </View>
        <View style={styles.row}>
          <Field label="Carbs (g)" value={carbs} onChange={setCarbs} />
          <Field label="Fat (g)" value={fat} onChange={setFat} />
        </View>
        <View style={styles.row}>
          <Field label="Fiber (g)" value={fiber} onChange={setFiber} />
          <View style={styles.halfField} />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, createMutation.isPending && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Food</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <View style={styles.halfField}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        placeholderTextColor={APP_COLORS.textLight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  scroll: { padding: SPACING.lg },
  heading: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.text, marginBottom: SPACING.lg },
  label: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: APP_COLORS.text, marginBottom: 4, marginTop: SPACING.sm },
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
  row: { flexDirection: 'row', gap: SPACING.md },
  halfField: { flex: 1 },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: APP_COLORS.text, marginTop: SPACING.lg, marginBottom: 4 },
  saveButton: {
    backgroundColor: APP_COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  buttonDisabled: { opacity: 0.6 },
  saveButtonText: { color: '#fff', fontSize: FONT_SIZES.lg, fontWeight: '700' },
});
