import React, { useEffect, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useColorScheme } from '../../components/useColorScheme';
import { useClientOnlyValue } from '../../components/useClientOnlyValue';
import { Colors } from '../../constants/Colors';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { View } from 'react-native';
import SurveyModal from '../survey/SurveyModal';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { backendBaseUrl } from '@/constants/app.constants';
import CoupleChatTabIcon from '@/components/CoupleChatTabIcon';
import { unreadCoupleChatAtom } from '@/atoms/notificationAtom';
import { Badge } from 'react-native-elements';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const user = useAtomValue(userAtom);
  const [surveyVisible, setSurveyVisible] = useState(false);
  const unreadCount = useAtomValue(unreadCoupleChatAtom);
  console.log("Badge에 쓰이는 unreadCount:", unreadCount);

  // useEffect(() => {
  //   // 1. user.survey_done이 없으면 띄우기, 없으면 API 요청으로 응답여부 체크
  //   async function checkSurvey() {
  //     const res = await fetch(`${backendBaseUrl}/survey/check?user_id=${user.user_id}`);
  //     const data = await res.json();
  //     setSurveyVisible(!data.done);
  //   }
  //   checkSurvey();
  // }, [user.user_id]);
  
  return (
    <View style={{ flex: 1 }}>
      {/* <SurveyModal visible={surveyVisible} userId={user.user_id} onComplete={() => setSurveyVisible(false)} /> */}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: useClientOnlyValue(false, true),
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: '홈',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="coupleChat"
          options={{
            title: '커플챗',
            tabBarIcon: ({ color }) => (
              <View>
                <IconSymbol size={28} name="paperplane.fill" color={color} />
                {unreadCount > 0 && (
                  <Badge value={unreadCount > 99 ? '99+' : unreadCount} status="error" containerStyle={{ position: 'absolute', right: -8, top: -6 }} />
                )}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="mypage"
          options={{
            title: '마이페이지',
            tabBarIcon: ({ color }) => <TabBarIcon name="smile-o" color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}
