import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { APP_COLORS, FONTS } from '../config/constants';

const TAB_ICONS: Record<string, { label: string; icon: string }> = {
  ProfileTab: { label: 'Profile', icon: '👤' },
  ExerciseTab: { label: 'Exercise', icon: '💪' },
  RewardsTab: { label: 'Rewards', icon: '🏆' },
  FoodTab: { label: 'Food', icon: '🍎' },
  ReferralTab: { label: 'More', icon: '📋' },
};

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const tabConfig = TAB_ICONS[route.name] ?? { label: route.name, icon: '•' };

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
          >
            <Text style={[styles.icon, isFocused && styles.iconActive]}>
              {tabConfig.icon}
            </Text>
            <Text
              style={[
                styles.label,
                { color: isFocused ? APP_COLORS.primary : APP_COLORS.tabBarInactive },
              ]}
            >
              {tabConfig.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: APP_COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: APP_COLORS.border,
    paddingTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  icon: {
    fontSize: 22,
    opacity: 0.6,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
  },
});
