import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '../hooks/useColorScheme';
import { useEffect } from 'react';
import { initializeKakaoSDK } from '@react-native-kakao/core';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PostProvider } from '../context/PostContext';
import { UserProvider } from '../context/UserContext'; // 👈 추가!

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    initializeKakaoSDK('b9d21a45b36f2d40d5e7be95091dbd4e');
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>                
        <PostProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              {/* <Stack.Screen name="+not-found" /> */}
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </PostProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
}
