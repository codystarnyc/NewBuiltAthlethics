import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import RootNavigator from './src/navigation/RootNavigator';
import { AppTheme } from './src/config/theme';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  },
});

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          Comfortaa_Regular: require('./assets/fonts/Comfortaa_Regular.ttf'),
          Comfortaa_SemiBold: require('./assets/fonts/Comfortaa_SemiBold.ttf'),
          Comfortaa_Bold: require('./assets/fonts/Comfortaa_Bold.ttf'),
          Comfortaa_Light: require('./assets/fonts/Comfortaa_Light.ttf'),
          Comfortaa_Medium: require('./assets/fonts/Comfortaa_Medium.ttf'),
        });
      } catch {
        // Fonts are optional during development
      } finally {
        setIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer theme={AppTheme}>
          <StatusBar
            barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
            backgroundColor="#003465"
          />
          <RootNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
