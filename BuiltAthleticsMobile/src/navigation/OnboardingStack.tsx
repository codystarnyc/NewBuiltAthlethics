import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from './types';
import { APP_COLORS } from '../config/constants';

import SelectGenderScreen from '../screens/onboarding/SelectGenderScreen';
import SetNameScreen from '../screens/onboarding/SetNameScreen';
import SelectWeightScreen from '../screens/onboarding/SelectWeightScreen';
import SelectHeightScreen from '../screens/onboarding/SelectHeightScreen';
import SelectDOBScreen from '../screens/onboarding/SelectDOBScreen';
import SelectRoutineDaysScreen from '../screens/onboarding/SelectRoutineDaysScreen';
import SelectFitnessGoalScreen from '../screens/onboarding/SelectFitnessGoalScreen';
import FitCoachScreen from '../screens/onboarding/FitCoachScreen';
import RestrictiveDietScreen from '../screens/onboarding/RestrictiveDietScreen';
import CreatePlanScreen from '../screens/onboarding/CreatePlanScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: APP_COLORS.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="SelectGender" component={SelectGenderScreen} />
      <Stack.Screen name="SetName" component={SetNameScreen} />
      <Stack.Screen name="SelectWeight" component={SelectWeightScreen} />
      <Stack.Screen name="SelectHeight" component={SelectHeightScreen} />
      <Stack.Screen name="SelectDOB" component={SelectDOBScreen} />
      <Stack.Screen name="SelectRoutineDays" component={SelectRoutineDaysScreen} />
      <Stack.Screen name="SelectFitnessGoal" component={SelectFitnessGoalScreen} />
      <Stack.Screen name="FitCoach" component={FitCoachScreen} />
      <Stack.Screen name="RestrictiveDiet" component={RestrictiveDietScreen} />
      <Stack.Screen name="CreatePlan" component={CreatePlanScreen} />
    </Stack.Navigator>
  );
}
