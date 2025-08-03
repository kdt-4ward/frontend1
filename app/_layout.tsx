import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { useColorScheme } from '../hooks/useColorScheme';
import React, { useEffect, useState } from 'react';
import { getKeyHashAndroid, initializeKakaoSDK } from '@react-native-kakao/core';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getServiceAccessToken } from '../utils/auth';
import { useAtomValue, useSetAtom } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { apiFetch } from '@/utils/api';
import * as Notifications from 'expo-notifications';
import { Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const setUser = useSetAtom(userAtom);
  const user = useAtomValue(userAtom);

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
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack initialRouteName={initialRoute}>
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="modal/SurveyModal" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          {/* <Stack.Screen
            name="modal/EmotionRecordFlow"
            options={{
              title: '',
              headerTitleStyle: {},
              headerShadowVisible: false,
              presentation: 'transparentModal',
              gestureDirection: 'vertical',
            }}
          /> */}
          <Stack.Screen
            name="screens/aiChat"
            options={{
              title: '',
              headerTitle: () => <Text style={{fontWeight:600, fontSize:18, color: 'rgba(0,0,0,0.8)'}}>러비와 대화하기</Text>,
              headerBackTitle: '홈',
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.dismiss()}>
                  <Ionicons name="chevron-back" size={26} color="rgba(0,0,0,0.5)" />
                </TouchableOpacity>
              ),
              headerStyle: {
                backgroundColor: 'rgba(199, 199, 199, 0.7)',
              },
              headerTitleStyle: {},
              headerShadowVisible: false,
              presentation: 'transparentModal',
              gestureDirection: 'vertical',
            }}
          />
          <Stack.Screen
            name="screens/tabpost" 
            options={{
              title: '',
              headerTitle: () => <Text style={{fontWeight:600, fontSize:18}}>우리의 앨범</Text>,
              headerBackTitle: '홈',
              headerShadowVisible: false,
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.dismiss()}>
                  <Ionicons name="chevron-back" size={26} color="rgba(0,0,0,0.5)" />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="post/edit" 
            options={{
              title: '',
              headerTitle: () => <Text style={{fontWeight:600, fontSize:18}}>사진 편집</Text>,
              headerBackTitle: '홈',
              headerShadowVisible: false,
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.dismiss()}>
                  <Ionicons name="chevron-back" size={26} color="rgba(0,0,0,0.5)" />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="screens/feelings"
            options={{
              title: '',
              headerTitle: () => <Text style={{fontWeight:600, fontSize:18}}>감정 기록</Text>,
              headerShadowVisible: false,
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.dismiss()}>
                  <Ionicons name="chevron-back" size={26} color="rgba(0,0,0,0.5)" />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="screens/solution_1"
            options={{
              title: '',
              headerTitle: () => <Text style={{fontWeight:600, fontSize:18}}>주간 리포트</Text>,
              headerShadowVisible: false,
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.dismiss()}>
                  <Ionicons name="chevron-back" size={26} color="rgba(0,0,0,0.5)" />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="screens/solution_2"
            options={{
              title: '',
              headerTitle: () => <Text style={{fontWeight:600, fontSize:18}}>솔루션</Text>,
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.dismiss()}>
                  <Ionicons name="chevron-back" size={26} color="rgba(0,0,0,0.5)" />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="webview/youtubeWebView"
            options={{
              title: '',
              headerTitle: () => <Text style={{fontWeight:600, fontSize:18}}>솔루션</Text>,
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.dismiss()}>
                  <Ionicons name="chevron-back" size={26} color="rgba(0,0,0,0.5)" />
                </TouchableOpacity>
              ),
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
