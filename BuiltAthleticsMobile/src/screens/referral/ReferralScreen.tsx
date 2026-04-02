import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/useAuthStore';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { ReferralScreenProps } from '../../navigation/types';

export default function ReferralScreen({ navigation }: ReferralScreenProps<'Referral'>) {
  const user = useAuthStore((s) => s.user);
  const referralCode = user?.referralCode ?? 'BUILTATHLETICS';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>More</Text>

        <View style={styles.referralCard}>
          <Text style={styles.referralTitle}>Invite Friends</Text>
          <Text style={styles.referralSub}>Share your code and earn GYMILES when friends sign up</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{referralCode}</Text>
          </View>
          <TouchableOpacity style={styles.shareButton} onPress={() => Alert.alert('Share', `Your code: ${referralCode}`)}>
            <Text style={styles.shareText}>Share Code</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.linksCard}>
          {[
            { label: 'Meal Plans', onPress: () => navigation.navigate('MealPlanHome') },
            { label: 'Recipes', onPress: () => navigation.navigate('RecipeList') },
            { label: 'Shopping List', onPress: () => navigation.navigate('ShoppingList') },
            { label: 'Meal Preferences', onPress: () => navigation.navigate('MealQuestions') },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={styles.linkRow} onPress={item.onPress}>
              <Text style={styles.linkText}>{item.label}</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  scroll: { padding: SPACING.lg },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.text, marginBottom: SPACING.lg },
  referralCard: { backgroundColor: APP_COLORS.primary, borderRadius: 16, padding: SPACING.lg, alignItems: 'center', marginBottom: SPACING.lg },
  referralTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: '#fff' },
  referralSub: { fontSize: FONT_SIZES.md, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: 4, marginBottom: SPACING.md },
  codeBox: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12, marginBottom: SPACING.md },
  codeText: { color: '#fff', fontSize: FONT_SIZES.xl, fontWeight: '800', letterSpacing: 2 },
  shareButton: { backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 28, paddingVertical: 12 },
  shareText: { color: APP_COLORS.primary, fontSize: FONT_SIZES.md, fontWeight: '700' },
  linksCard: { backgroundColor: APP_COLORS.surface, borderRadius: 14, overflow: 'hidden' },
  linkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: APP_COLORS.border },
  linkText: { fontSize: FONT_SIZES.md, color: APP_COLORS.text },
  arrow: { fontSize: 20, color: APP_COLORS.textLight },
});
