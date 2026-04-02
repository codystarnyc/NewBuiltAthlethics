import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { FoodStackParamList } from '../types';
import { APP_COLORS } from '../../config/constants';

import FoodDiaryScreen from '../../screens/food/FoodDiaryScreen';
import FoodListScreen from '../../screens/food/FoodListScreen';
import BarcodeScannerScreen from '../../screens/food/BarcodeScannerScreen';
import FoodDetailsScreen from '../../screens/food/FoodDetailsScreen';
import CreateFoodScreen from '../../screens/food/CreateFoodScreen';
import CalorieMamaScreen from '../../screens/food/CalorieMamaScreen';
import FuelTrackScreen from '../../screens/fueltrack/FuelTrackScreen';

const Stack = createNativeStackNavigator<FoodStackParamList>();

export default function FoodStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: APP_COLORS.primary,
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="FoodDiary" component={FoodDiaryScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FoodList" component={FoodListScreen} options={{ title: 'Search Food' }} />
      <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} options={{ title: 'Scan Barcode' }} />
      <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} options={{ title: 'Food Details' }} />
      <Stack.Screen name="CreateFood" component={CreateFoodScreen} options={{ title: 'Add Food' }} />
      <Stack.Screen name="CalorieMama" component={CalorieMamaScreen} options={{ title: 'AI Food Recognition' }} />
      <Stack.Screen name="FuelTrack" component={FuelTrackScreen} options={{ title: 'FuelTrack', headerShown: false }} />
    </Stack.Navigator>
  );
}
