import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';

export default function AddWeightScreen({ navigation }: { navigation: { goBack: () => void } }) {
  const [weight, setWeight] = useState('');

  function handleSave() {
    if (!weight || isNaN(parseFloat(weight))) return Alert.alert('Error', 'Enter a valid weight');
    Alert.alert('Saved', `Weight logged: ${weight} lbs`);
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>Log Weight</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>

        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
          placeholder="Enter weight"
          placeholderTextColor={APP_COLORS.textLight}
          autoFocus
        />
        <Text style={styles.unit}>lbs</Text>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_COLORS.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: APP_COLORS.text, marginBottom: 4 },
  date: { fontSize: FONT_SIZES.md, color: APP_COLORS.textSecondary, marginBottom: SPACING.xl },
  input: { fontSize: 48, fontWeight: '800', color: APP_COLORS.primary, textAlign: 'center', width: '60%', borderBottomWidth: 2, borderBottomColor: APP_COLORS.primary, paddingVertical: 8 },
  unit: { fontSize: FONT_SIZES.lg, color: APP_COLORS.textSecondary, marginTop: 8 },
  button: { backgroundColor: APP_COLORS.primary, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 64, marginTop: SPACING.xl },
  buttonText: { color: '#fff', fontSize: FONT_SIZES.lg, fontWeight: '700' },
});
