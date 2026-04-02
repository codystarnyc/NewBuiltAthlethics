import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { ExerciseScreenProps } from '../../navigation/types';

const CATEGORIES = [
  { id: 'chest', name: 'Chest', icon: '🫁' },
  { id: 'back', name: 'Back', icon: '🔙' },
  { id: 'legs', name: 'Legs', icon: '🦵' },
  { id: 'shoulders', name: 'Shoulders', icon: '💪' },
  { id: 'arms', name: 'Arms', icon: '🦾' },
  { id: 'core', name: 'Core', icon: '🎯' },
  { id: 'cardio', name: 'Cardio', icon: '🏃' },
  { id: 'stretching', name: 'Stretching', icon: '🧘' },
];

export default function WorkoutLibraryScreen({ navigation }: ExerciseScreenProps<'WorkoutLibrary'>) {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ExerciseCategories')}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  list: { padding: SPACING.lg },
  row: { gap: SPACING.md, marginBottom: SPACING.md },
  card: {
    flex: 1,
    backgroundColor: APP_COLORS.surface,
    borderRadius: 14,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  icon: { fontSize: 36, marginBottom: 8 },
  name: { fontSize: FONT_SIZES.md, fontWeight: '600', color: APP_COLORS.text },
});
