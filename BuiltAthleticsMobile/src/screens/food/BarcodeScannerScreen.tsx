import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { APP_COLORS, SPACING, FONT_SIZES } from '../../config/constants';
import type { FoodScreenProps } from '../../navigation/types';

export default function BarcodeScannerScreen({ navigation }: FoodScreenProps<'BarcodeScanner'>) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  function handleBarCodeScanned({ data }: { data: string }) {
    if (scanned) return;
    setScanned(true);
    navigation.navigate('FoodDetails', { foodId: data });
  }

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Camera permission is required to scan barcodes</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128'] }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      <View style={styles.overlay}>
        <View style={styles.scanFrame} />
        <Text style={styles.hint}>Align barcode within the frame</Text>
      </View>
      {scanned && (
        <TouchableOpacity style={styles.rescanButton} onPress={() => setScanned(false)}>
          <Text style={styles.rescanText}>Tap to Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: APP_COLORS.background, padding: SPACING.lg },
  message: { fontSize: FONT_SIZES.lg, color: APP_COLORS.text, textAlign: 'center', marginBottom: SPACING.md },
  button: { backgroundColor: APP_COLORS.primary, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32 },
  buttonText: { color: '#fff', fontSize: FONT_SIZES.md, fontWeight: '700' },
  overlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  scanFrame: {
    width: 260,
    height: 160,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 12,
  },
  hint: { color: '#fff', fontSize: FONT_SIZES.md, marginTop: SPACING.md, fontWeight: '600' },
  rescanButton: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    backgroundColor: APP_COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  rescanText: { color: '#fff', fontSize: FONT_SIZES.md, fontWeight: '700' },
});
