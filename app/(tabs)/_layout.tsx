import React, { useEffect, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import SurveyModal from '../modal/SurveyModal';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { backendBaseUrl } from '@/constants/app.constants';
import CoupleChatTabIcon from '@/components/CoupleChatTabIcon';
import { unreadCoupleChatAtom } from '@/atoms/notificationAtom';
import { Badge } from 'react-native-elements';
import { coupleAtom } from '@/atoms/coupleAtom';
import { apiFetch } from '@/utils/api';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

type Couple = {
  couple_id: string;
  user1: {
    user_id: string;
    nickname: string;
    profile_image: string;
  } | null;
  user2: {
    user_id: string;
    nickname: string;
    profile_image: string;
  } | null;
}

export default function TabLayout() {
  const user = useAtomValue(userAtom);
  const [couple, setCouple] = useState<Couple>();
  const [surveyVisible, setSurveyVisible] = useState(false);
  const unreadCount = useAtomValue(unreadCoupleChatAtom);
  console.log("Badge에 쓰이는 unreadCount:", unreadCount);

  useEffect(() => {
    if (!user?.user_id) return;
    console.log("유저아이디: ", user.user_id);
    // 로그인 이후, 설문 응답 여부 확인
    const getCoupleInfo = async () => {
      try {
        if (user.couple_id) {
          const coupleRes = await apiFetch(`/couple/info/${user.couple_id}`);
          if (coupleRes.ok) {
            const coupleInfo = await coupleRes.json();
            setCouple(coupleInfo);
          }
        }
      } catch (e) {
        console.log("커플 정보 가져오기 에러: ", e);
      }
    };
    getCoupleInfo();
  }, [user?.user_id]);

  console.log("커플", couple)

  useEffect(() => {
    if (!user?.user_id) return;
    console.log("유저아이디: ", user.user_id);
    // 로그인 이후, 설문 응답 여부 확인
    const checkSurvey = async () => {
      try {
        const res = await fetch(`${backendBaseUrl}/survey/check?user_id=${user.user_id}`);
        const data = await res.json();
        console.log("설문조사 완료 여부 체크: ", data);
        setSurveyVisible(!data.done); // done이 false면 모달 ON
      } catch (e) {
        console.log("설문조사 완료 여부 체크 에러: ", e);
      }
    };
    checkSurvey();
  }, [user?.user_id]);
  
  return (
    <View style={{ flex: 1 }}>
      <SurveyModal visible={surveyVisible} userId={user?.user_id} onComplete={() => setSurveyVisible(false)} />
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,    // android 그림자
            shadowOpacity: 0, // ios 그림자
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 90,
            // boxShadow 등은 elevation(안드), shadowXXX(ios) 조합
            // shadowColor: "#222", // iOS
            // shadowOffset: { width: 0, height: -2 },
            // shadowOpacity: 0.12,
            // shadowRadius: 6,
            // elevation: 10, // Android
          },
          tabBarLabelStyle: {
            fontSize: 13,
            marginTop: 5,
          },
          headerShown: false,
          headerStyle: {},
          headerTitleStyle: {},
          headerShadowVisible: false, // 그림자 안보이게
          headerTitleAlign: 'center', // 타이틀 중앙정렬
          // headerRight: () => (
          //   <FontAwesome
          //     name="bell"
          //     size={22}
          //     color="#b299f7"
          //     style={{ marginRight: 18 }}
          //     // onPress={() => ...} // 버튼 기능 추가 가능
          //   />
          // ),
          // headerLeft: () => <Text style={{ marginLeft: 16 }}>뒤로</Text>, // 필요시
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: '홈',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                name="home"
                color={focused ? '#fff' : 'rgba(168, 168, 168, 0.8)'} // home만 이런 색!
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text style={{ color: focused ? '#fff' : 'rgba(168, 168, 168, 0.8)', fontSize: 13 }}>
                홈
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="coupleChat"
          options={{
            title: `${user?.user_id === couple?.user1?.user_id ? couple?.user2?.nickname : couple?.user1?.nickname}`,
            headerShown: true,
            headerStyle: {
              backgroundColor: '#D5DFFD',
            },
            headerTitleStyle: {},
            headerShadowVisible: false,
            tabBarIcon: ({ focused }) => (
              <View>
                <TabBarIcon
                  name="wechat"
                  color={focused ? '#7493F7' : 'rgba(168, 168, 168, 0.8)'}
                />
                {unreadCount > 0 && (
                  <Badge value={unreadCount > 99 ? '99+' : unreadCount} status="error" containerStyle={{ position: 'absolute', right: -8, top: -6 }} />
                )}
              </View>
            ),
            tabBarLabel: ({ focused }) => (
              <Text style={{ color: focused ? '#7493F7' : 'rgba(168, 168, 168, 0.8)', fontSize: 13 }}>
                연인톡
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="mypage"
          options={{
            title: '설정',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTitleStyle: {},
            headerShadowVisible: true,
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                name="user"
                color={focused ? '#7493F7' : 'rgba(168, 168, 168, 0.8)'}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text style={{ color: focused ? '#7493F7' : 'rgba(168, 168, 168, 0.8)', fontSize: 13 }}>
                마이페이지
              </Text>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
