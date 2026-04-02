import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RewardsStackParamList } from '../types';
import { APP_COLORS } from '../../config/constants';

import RewardsScreen from '../../screens/rewards/RewardsScreen';
import ProductListingScreen from '../../screens/rewards/ProductListingScreen';
import ProductDetailsScreen from '../../screens/rewards/ProductDetailsScreen';
import CartScreen from '../../screens/rewards/CartScreen';
import CheckoutScreen from '../../screens/rewards/CheckoutScreen';
import OrdersScreen from '../../screens/rewards/OrdersScreen';

const Stack = createNativeStackNavigator<RewardsStackParamList>();

export default function RewardsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: APP_COLORS.primary,
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="Rewards" component={RewardsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProductListing" component={ProductListingScreen} options={{ title: 'Products' }} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: 'Product' }} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: 'Order History' }} />
    </Stack.Navigator>
  );
}
