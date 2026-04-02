import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from './types';
import TabBar from '../components/TabBar';

import ProfileStack from './stacks/ProfileStack';
import ExerciseStack from './stacks/ExerciseStack';
import RewardsStack from './stacks/RewardsStack';
import FoodStack from './stacks/FoodStack';
import ReferralStack from './stacks/ReferralStack';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="ProfileTab"
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="ProfileTab" component={ProfileStack} />
      <Tab.Screen name="ExerciseTab" component={ExerciseStack} />
      <Tab.Screen name="RewardsTab" component={RewardsStack} />
      <Tab.Screen name="FoodTab" component={FoodStack} />
      <Tab.Screen name="ReferralTab" component={ReferralStack} />
    </Tab.Navigator>
  );
}
