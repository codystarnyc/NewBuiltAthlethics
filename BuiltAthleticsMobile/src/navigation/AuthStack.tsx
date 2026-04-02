import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from './types';
import { APP_COLORS } from '../config/constants';

import IntroScreen from '../screens/auth/IntroScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Intro"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: APP_COLORS.background },
      }}
    >
      <Stack.Screen name="Intro" component={IntroScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: true, title: 'Reset Password' }}
      />
    </Stack.Navigator>
  );
}
