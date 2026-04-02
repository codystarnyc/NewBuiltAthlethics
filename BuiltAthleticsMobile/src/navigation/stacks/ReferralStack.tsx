import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ReferralStackParamList } from '../types';
import { APP_COLORS } from '../../config/constants';

import ReferralScreen from '../../screens/referral/ReferralScreen';
import MealPlanHomeScreen from '../../screens/mealplan/MealPlanHomeScreen';
import CreateMealPlanScreen from '../../screens/mealplan/CreateMealPlanScreen';
import RecipeDetailsScreen from '../../screens/mealplan/RecipeDetailsScreen';
import RecipeListScreen from '../../screens/mealplan/RecipeListScreen';
import ShoppingListScreen from '../../screens/mealplan/ShoppingListScreen';
import MealQuestionsScreen from '../../screens/mealplan/MealQuestionsScreen';

const Stack = createNativeStackNavigator<ReferralStackParamList>();

export default function ReferralStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: APP_COLORS.primary,
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="Referral" component={ReferralScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MealPlanHome" component={MealPlanHomeScreen} options={{ title: 'Meal Plans' }} />
      <Stack.Screen name="CreateMealPlan" component={CreateMealPlanScreen} options={{ title: 'Create Plan' }} />
      <Stack.Screen name="RecipeDetails" component={RecipeDetailsScreen} options={{ title: 'Recipe' }} />
      <Stack.Screen name="RecipeList" component={RecipeListScreen} options={{ title: 'Recipes' }} />
      <Stack.Screen name="ShoppingList" component={ShoppingListScreen} options={{ title: 'Shopping List' }} />
      <Stack.Screen name="MealQuestions" component={MealQuestionsScreen} options={{ title: 'Preferences' }} />
    </Stack.Navigator>
  );
}
