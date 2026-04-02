import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';

const SAMPLE_VIDEOS = [
  { id: '1', title: 'Proper Squat Form', category: 'Legs', duration: '3:45' },
  { id: '2', title: 'Bench Press Guide', category: 'Chest', duration: '4:20' },
  { id: '3', title: 'Deadlift Technique', category: 'Back', duration: '5:10' },
  { id: '4', title: 'Overhead Press', category: 'Shoulders', duration: '3:00' },
  { id: '5', title: 'Pull-Up Progression', category: 'Back', duration: '6:30' },
  { id: '6', title: 'Plank Variations', category: 'Core', duration: '4:00' },
];

export default function VideoListScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={SAMPLE_VIDEOS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.thumbnail}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.meta}>{item.category} · {item.duration}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  list: { padding: SPACING.lg },
  card: { flexDirection: 'row', backgroundColor: APP_COLORS.surface, borderRadius: 14, marginBottom: SPACING.sm, overflow: 'hidden' },
  thumbnail: { width: 90, height: 70, backgroundColor: APP_COLORS.primary + '20', alignItems: 'center', justifyContent: 'center' },
  playIcon: { fontSize: 24, color: APP_COLORS.primary },
  info: { flex: 1, padding: SPACING.md, justifyContent: 'center' },
  title: { fontSize: FONT_SIZES.md, fontWeight: '600', color: APP_COLORS.text },
  meta: { fontSize: FONT_SIZES.sm, color: APP_COLORS.textSecondary, marginTop: 4 },
});
