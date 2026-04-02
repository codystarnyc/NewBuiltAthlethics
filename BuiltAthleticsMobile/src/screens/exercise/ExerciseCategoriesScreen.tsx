import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { ExerciseScreenProps } from '../../navigation/types';

const SAMPLE_CATEGORIES = [
  { id: '1', name: 'Chest', count: 24 },
  { id: '2', name: 'Back', count: 18 },
  { id: '3', name: 'Legs', count: 32 },
  { id: '4', name: 'Shoulders', count: 16 },
  { id: '5', name: 'Biceps', count: 12 },
  { id: '6', name: 'Triceps', count: 14 },
  { id: '7', name: 'Abs', count: 20 },
  { id: '8', name: 'Cardio', count: 10 },
];

export default function ExerciseCategoriesScreen({ navigation }: ExerciseScreenProps<'ExerciseCategories'>) {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={SAMPLE_CATEGORIES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('ExerciseDetails', { exerciseId: item.id, exerciseName: item.name })}
          >
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.count}>{item.count} exercises</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  list: { padding: SPACING.lg },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: APP_COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 16,
    marginBottom: 8,
  },
  name: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: APP_COLORS.text },
  count: { fontSize: FONT_SIZES.sm, color: APP_COLORS.textSecondary, marginTop: 2 },
  arrow: { fontSize: 22, color: APP_COLORS.textLight },
});
