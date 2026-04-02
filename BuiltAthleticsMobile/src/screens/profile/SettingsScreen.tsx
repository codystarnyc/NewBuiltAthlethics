import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/useAuthStore';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { ProfileScreenProps } from '../../navigation/types';

const SECTIONS = [
  {
    title: 'Account',
    items: [
      { label: 'Body Measurements', screen: 'BodyMeasurements' },
      { label: 'Connected Wearables', screen: 'WearableList' },
    ],
  },
  {
    title: 'App',
    items: [
      { label: 'Notifications', screen: null },
      { label: 'Units & Preferences', screen: null },
    ],
  },
  {
    title: 'Danger Zone',
    items: [
      { label: 'Delete Account', screen: 'DeleteAccount' },
    ],
  },
];

export default function SettingsScreen({ navigation }: ProfileScreenProps<'Settings'>) {
  const logout = useAuthStore((s) => s.logout);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.card}>
              {section.items.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={styles.row}
                  onPress={() => item.screen ? navigation.navigate(item.screen as never) : Alert.alert('Coming Soon')}
                >
                  <Text style={[styles.rowText, section.title === 'Danger Zone' && styles.dangerText]}>{item.label}</Text>
                  <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  scroll: { padding: SPACING.lg },
  section: { marginBottom: SPACING.lg },
  sectionTitle: { fontSize: FONT_SIZES.sm, fontWeight: '700', color: APP_COLORS.textSecondary, textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 },
  card: { backgroundColor: APP_COLORS.surface, borderRadius: 14, overflow: 'hidden' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: APP_COLORS.border },
  rowText: { fontSize: FONT_SIZES.md, color: APP_COLORS.text },
  dangerText: { color: APP_COLORS.error },
  arrow: { fontSize: 20, color: APP_COLORS.textLight },
  logoutButton: { borderWidth: 1, borderColor: APP_COLORS.error, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: SPACING.md },
  logoutText: { fontSize: FONT_SIZES.md, fontWeight: '600', color: APP_COLORS.error },
});
