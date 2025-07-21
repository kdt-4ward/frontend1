import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { useColorScheme } from '../hooks/useColorScheme';
import React, { useEffect, useState } from 'react';
import { getKeyHashAndroid, initializeKakaoSDK } from '@react-native-kakao/core';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getServiceAccessToken } from '../utils/auth';
import { useSetAtom } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { apiFetch } from '@/utils/api';
import * as Notifications from 'expo-notifications';
import { Text } from 'react-native';

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

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('알림 권한이 필요합니다!');
      }
    })();
  }, []);

  if (!initialRoute) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack initialRouteName={initialRoute}>
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="survey/surveyQuestions.ts" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen
            name="screens/aiChat"
            options={{
              title: '',
              headerTitle: () => <Text style={{fontWeight:'bold', fontSize:18}}>AI챗</Text>,
              headerBackTitle: '홈',
            }}
          />
          <Stack.Screen
            name="screens/tabpost" 
            options={{
              title: '',
              headerTitle: () => <Text style={{fontWeight:'bold', fontSize:18}}>게시글 작성</Text>,
              headerBackTitle: '홈',
            }}
          />
          <Stack.Screen
            name="screens/feelings"
            options={{
              title: '',
              headerTitle: () => <Text style={{fontWeight:'bold', fontSize:18}}>감정 기록</Text>,
              headerBackTitle: '홈',
            }}
          />
          <Stack.Screen
            name="screens/solution_preview"
            options={{
              title: '',
              headerTitle: () => <Text style={{fontWeight:'bold', fontSize:18}}>솔루션</Text>,
              headerBackTitle: '홈',
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
