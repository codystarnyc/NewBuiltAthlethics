import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useImageUpload, useProcessingResult } from '../../hooks/useUpload';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { FoodAnalysis, BodyAnalysis, ReceiptAnalysis } from '../../api/types';

export default function CalorieMamaScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const uploadMutation = useImageUpload();
  const { data: result } = useProcessingResult(uploadId);

  async function pickFromCamera() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return Alert.alert('Permission needed', 'Camera access is required');

    const picked = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!picked.canceled && picked.assets[0]) {
      handleUpload(picked.assets[0].uri);
    }
  }

  async function pickFromGallery() {
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!picked.canceled && picked.assets[0]) {
      handleUpload(picked.assets[0].uri);
    }
  }

  async function handleUpload(uri: string) {
    setImageUri(uri);
    setUploadId(null);
    try {
      const res = await uploadMutation.mutateAsync({ uri, type: 'food' });
      setUploadId(res.id);
    } catch {
      Alert.alert('Upload Failed', 'Could not upload the image. Please try again.');
    }
  }

  const isProcessing = result?.status === 'processing' || result?.status === 'pending';
  const isComplete = result?.status === 'completed';
  const isFailed = result?.status === 'failed';
  const foodResult = isComplete ? (result?.result as FoodAnalysis | null) : null;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {!imageUri ? (
          <View style={styles.placeholder}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>AI</Text>
            </View>
            <Text style={styles.placeholderTitle}>AI Food Recognition</Text>
            <Text style={styles.placeholderSub}>
              Take a photo or choose from gallery to analyze food and get instant nutrition data
            </Text>
          </View>
        ) : (
          <Image source={{ uri: imageUri }} style={styles.preview} />
        )}

        {isProcessing && (
          <View style={styles.statusCard}>
            <ActivityIndicator size="large" color={APP_COLORS.primary} />
            <Text style={styles.statusText}>Analyzing your food...</Text>
            {result?.processingTimeMs == null && (
              <Text style={styles.statusSub}>This usually takes 2-5 seconds</Text>
            )}
          </View>
        )}

        {isFailed && (
          <View style={[styles.statusCard, styles.errorCard]}>
            <Text style={styles.errorText}>Analysis failed</Text>
            <Text style={styles.statusSub}>{result?.error ?? 'Unknown error'}</Text>
          </View>
        )}

        {foodResult && foodResult.foods && foodResult.foods.length > 0 && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Detected Foods</Text>
            {foodResult.foods.map((food, i) => (
              <View key={i} style={styles.foodRow}>
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodQty}>{food.quantity}</Text>
                </View>
                <View style={styles.foodMacros}>
                  <Text style={styles.macroPrimary}>{Math.round(food.calories)} cal</Text>
                  <Text style={styles.macroSub}>
                    P:{Math.round(food.protein)}g C:{Math.round(food.carbs)}g F:{Math.round(food.fat)}g
                  </Text>
                </View>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{Math.round(foodResult.totalCalories)} kcal</Text>
            </View>
            <View style={styles.macroTotals}>
              <MacroPill label="Protein" value={`${Math.round(foodResult.totalProtein)}g`} color={APP_COLORS.primary} />
              <MacroPill label="Carbs" value={`${Math.round(foodResult.totalCarbs)}g`} color={APP_COLORS.accent} />
              <MacroPill label="Fat" value={`${Math.round(foodResult.totalFat)}g`} color={APP_COLORS.warning} />
            </View>

            {foodResult.mealInsulinScore !== undefined && (
              <View style={styles.insulinRow}>
                <Text style={styles.insulinLabel}>Insulin Impact</Text>
                <Text style={[
                  styles.insulinValue,
                  { color: foodResult.mealInsulinScore <= 4 ? APP_COLORS.success : foodResult.mealInsulinScore <= 6 ? APP_COLORS.warning : APP_COLORS.error },
                ]}>
                  {foodResult.mealInsulinScore}/10
                </Text>
              </View>
            )}

            {foodResult.pfcOrder && foodResult.pfcOrder.length > 0 && (
              <View style={styles.pfcCard}>
                <Text style={styles.pfcTitle}>Recommended Eating Order</Text>
                {foodResult.pfcOrder.map((name, idx) => (
                  <Text key={idx} style={styles.pfcItem}>
                    {idx + 1}. {name}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        {isComplete && foodResult && foodResult.foods?.length === 0 && (
          <View style={styles.statusCard}>
            <Text style={styles.statusText}>No food detected in image</Text>
            <Text style={styles.statusSub}>Try taking a clearer photo of your meal</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton} onPress={pickFromCamera}>
          <Text style={styles.actionButtonText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={pickFromGallery}>
          <Text style={[styles.actionButtonText, styles.secondaryText]}>Gallery</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function MacroPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[pillStyles.pill, { borderColor: color }]}>
      <Text style={[pillStyles.value, { color }]}>{value}</Text>
      <Text style={pillStyles.label}>{label}</Text>
    </View>
  );
}

const pillStyles = StyleSheet.create({
  pill: { borderWidth: 1.5, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14, alignItems: 'center' },
  value: { fontSize: FONT_SIZES.md, fontWeight: '700' },
  label: { fontSize: FONT_SIZES.xs, color: APP_COLORS.textSecondary, marginTop: 2 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  scroll: { padding: SPACING.lg, paddingBottom: 100 },
  placeholder: { alignItems: 'center', paddingVertical: 60 },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: APP_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  iconText: { color: '#fff', fontSize: 24, fontWeight: '800' },
  placeholderTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: APP_COLORS.text, marginBottom: 8 },
  placeholderSub: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, textAlign: 'center', paddingHorizontal: SPACING.lg },
  preview: { width: '100%', height: 250, borderRadius: 16, marginBottom: SPACING.md },
  statusCard: {
    backgroundColor: APP_COLORS.surface,
    borderRadius: 14,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  errorCard: { borderWidth: 1, borderColor: APP_COLORS.error },
  statusText: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: APP_COLORS.text, marginTop: SPACING.sm },
  statusSub: { fontSize: FONT_SIZES.sm, color: APP_COLORS.textSecondary, marginTop: 4 },
  errorText: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: APP_COLORS.error },
  resultCard: {
    backgroundColor: APP_COLORS.surface,
    borderRadius: 14,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  resultTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: APP_COLORS.text, marginBottom: SPACING.md },
  foodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.border,
  },
  foodInfo: { flex: 1 },
  foodName: { fontSize: FONT_SIZES.md, fontWeight: '600', color: APP_COLORS.text },
  foodQty: { fontSize: FONT_SIZES.sm, color: APP_COLORS.textSecondary, marginTop: 2 },
  foodMacros: { alignItems: 'flex-end' },
  macroPrimary: { fontSize: FONT_SIZES.md, fontWeight: '700', color: APP_COLORS.primary },
  macroSub: { fontSize: FONT_SIZES.xs, color: APP_COLORS.textSecondary, marginTop: 2 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  totalLabel: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: APP_COLORS.text },
  totalValue: { fontSize: FONT_SIZES.lg, fontWeight: '800', color: APP_COLORS.primary },
  macroTotals: { flexDirection: 'row', justifyContent: 'space-around' },
  insulinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.border,
  },
  insulinLabel: { fontSize: FONT_SIZES.md, fontWeight: '600', color: APP_COLORS.text },
  insulinValue: { fontSize: FONT_SIZES.xl, fontWeight: '800' },
  pfcCard: {
    backgroundColor: '#F0F7FF',
    borderRadius: 10,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  pfcTitle: { fontSize: FONT_SIZES.sm, fontWeight: '700', color: APP_COLORS.primary, marginBottom: 6 },
  pfcItem: { fontSize: FONT_SIZES.md, color: APP_COLORS.text, paddingVertical: 2 },
  buttonRow: {
    flexDirection: 'row',
    padding: SPACING.lg,
    gap: SPACING.md,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: APP_COLORS.background,
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.border,
  },
  actionButton: {
    flex: 1,
    backgroundColor: APP_COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButton: { backgroundColor: APP_COLORS.surface, borderWidth: 1, borderColor: APP_COLORS.primary },
  actionButtonText: { fontSize: FONT_SIZES.md, fontWeight: '700', color: '#fff' },
  secondaryText: { color: APP_COLORS.primary },
});
