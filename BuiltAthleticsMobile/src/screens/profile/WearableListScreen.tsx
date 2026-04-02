import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';

const WEARABLES = [
  { id: 'apple', name: 'Apple Health', connected: false },
  { id: 'google', name: 'Google Fit', connected: false },
  { id: 'fitbit', name: 'Fitbit', connected: false },
  { id: 'garmin', name: 'Garmin', connected: false },
];

export default function WearableListScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={WEARABLES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name}>{item.name}</Text>
            <TouchableOpacity style={[styles.badge, item.connected && styles.badgeConnected]}>
              <Text style={[styles.badgeText, item.connected && styles.badgeTextConnected]}>
                {item.connected ? 'Connected' : 'Connect'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  list: { padding: SPACING.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: APP_COLORS.surface, borderRadius: 12, paddingHorizontal: SPACING.lg, paddingVertical: 16, marginBottom: 8 },
  name: { fontSize: FONT_SIZES.md, fontWeight: '600', color: APP_COLORS.text },
  badge: { borderWidth: 1, borderColor: APP_COLORS.primary, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6 },
  badgeConnected: { backgroundColor: APP_COLORS.success, borderColor: APP_COLORS.success },
  badgeText: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: APP_COLORS.primary },
  badgeTextConnected: { color: '#fff' },
});
