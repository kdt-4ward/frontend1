import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { useColorScheme } from '../hooks/useColorScheme';
import { useEffect, useState } from 'react';
import { getKeyHashAndroid, initializeKakaoSDK } from '@react-native-kakao/core';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider } from '../context/UserContext';
import { getServiceAccessToken } from '../utils/auth';
import { useSetAtom } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { apiFetch } from '@/utils/api';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const setUser = useSetAtom(userAtom);

  useEffect(() => {
    initializeKakaoSDK('b9d21a45b36f2d40d5e7be95091dbd4e');
  }, []);

  useEffect(() => {
    (async () => {
      const token = await getServiceAccessToken();
      if (token) {
        // 서비스 JWT로 유저 정보 가져오기
        const res = await apiFetch('/auth/me', { method: 'GET' });
        if (res.ok) {
          const userInfo = await res.json();
          setUser(userInfo); // jotai에 글로벌 저장!
          setInitialRoute('(tabs)');
        } else {
          setInitialRoute('onboarding');
        }
      } else {
        setInitialRoute('onboarding');
      }
    })();
    SplashScreen.hideAsync();
  }, []);

  if (!initialRoute) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack initialRouteName={initialRoute}>
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* <Stack.Screen name="+not-found" /> */}
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
}
