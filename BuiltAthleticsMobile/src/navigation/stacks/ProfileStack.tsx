import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../types';
import { APP_COLORS } from '../../config/constants';

import ProfileScreen from '../../screens/profile/ProfileScreen';
import SettingsScreen from '../../screens/profile/SettingsScreen';
import BodyMeasurementsScreen from '../../screens/profile/BodyMeasurementsScreen';
import FitpalDashboardScreen from '../../screens/profile/FitpalDashboardScreen';
import AddWeightScreen from '../../screens/profile/AddWeightScreen';
import WearableListScreen from '../../screens/profile/WearableListScreen';
import DeleteAccountScreen from '../../screens/profile/DeleteAccountScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: APP_COLORS.primary,
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="BodyMeasurements" component={BodyMeasurementsScreen} options={{ title: 'Body Measurements' }} />
      <Stack.Screen name="FitpalDashboard" component={FitpalDashboardScreen} options={{ title: 'FitPal' }} />
      <Stack.Screen name="AddWeight" component={AddWeightScreen} options={{ title: 'Log Weight' }} />
      <Stack.Screen name="WearableList" component={WearableListScreen} options={{ title: 'Wearables' }} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} options={{ title: 'Delete Account' }} />
    </Stack.Navigator>
  );
}
