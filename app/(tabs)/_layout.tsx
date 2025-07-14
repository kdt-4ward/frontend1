// import React, { useState, createContext } from 'react';
// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { Link, Tabs } from 'expo-router';
// import { Pressable } from 'react-native';
// import Colors from '@/constants/Colors';
// import { useColorScheme } from '@/components/useColorScheme';
// import { useClientOnlyValue } from '@/components/useClientOnlyValue';
// import { EmotionProvider } from '@/context/EmotionContext';

// // User 타입에 couple_id 반드시 포함!
// interface User {
//   user_id: string;
//   name: string;
//   email: string;
//   couple_id: string;
// }

// // ✅ 테스트용 계정 (여기서 계정/커플ID 바꿔가며 테스트 가능!)
// const DEFAULT_TEST_USER: User = {
//   user_id: 'test1',          // 내 테스트 계정
//   name: '테스트유저1',
//   email: 'test1@example.com',
//   couple_id: 'couple1',      // 연인과 맞춰야 함!
// };

// // Context 정의 (변경 없음)
// export const UserContext = createContext<{
//   userInfo: User | null;
//   setUserInfo: (user: User) => void;
// }>({
//   userInfo: null,
//   setUserInfo: () => {},
// });

// function TabBarIcon(props: {
//   name: React.ComponentProps<typeof FontAwesome>['name'];
//   color: string;
// }) {
//   return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
// }

// export default function TabLayout() {
//   const colorScheme = useColorScheme();
//   // ⭐️ userInfo를 테스트 계정으로 초기화!
//   const [userInfo, setUserInfo] = useState<User | null>(DEFAULT_TEST_USER);

//   return (
//     <UserContext.Provider value={{ userInfo, setUserInfo }}>
//       <EmotionProvider>
//         <Tabs
//           screenOptions={{
//             tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//             headerShown: useClientOnlyValue(false, true),
//           }}
//         >
//           <Tabs.Screen
//             name="index"
//             options={{
//               title: 'Tab One',
//               tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
//               headerRight: () => (
//                 <Link href="/modal" asChild>
//                   <Pressable>
//                     {({ pressed }) => (
//                       <FontAwesome
//                         name="info-circle"
//                         size={25}
//                         color={Colors[colorScheme ?? 'light'].text}
//                         style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
//                       />
//                     )}
//                   </Pressable>
//                 </Link>
//               ),
//             }}
//           />
//           <Tabs.Screen
//             name="two"
//             options={{
//               title: 'Tab Two',
//               tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
//             }}
//           />
//           <Tabs.Screen
//             name="feelings"
//             options={{
//               title: '감정 기록',
//               tabBarIcon: ({ color }) => <TabBarIcon name="smile-o" color={color} />,
//             }}
//           />
//           <Tabs.Screen
//             name="tabpost"
//             options={{
//               title: '게시글',
//               tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
//             }}
//           />
//         </Tabs>
//       </EmotionProvider>
//     </UserContext.Provider>
//   );
// }

import React, { useState, createContext } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import Colors from '@/constants/Colors';
import { EmotionProvider } from '@/context/EmotionContext';

// User 타입에 couple_id 반드시 포함!
interface User {
  user_id: string;
  name: string;
  email: string;
  couple_id: string;
}

// ✅ 테스트용 계정
const DEFAULT_TEST_USER: User = {
  user_id: 'test1',
  name: '테스트유저1',
  email: 'test1@example.com',
  couple_id: 'couple1',
};

// Context 정의
export const UserContext = createContext<{
  userInfo: User | null;
  setUserInfo: (user: User) => void;
}>({
  userInfo: null,
  setUserInfo: () => {},
});

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [userInfo, setUserInfo] = useState<User | null>(DEFAULT_TEST_USER);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      <EmotionProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: useClientOnlyValue(false, true),
          }}
        >
          {/* 나중에 홈 탭(index)을 1번째로 추가할 수 있게 주석으로 확보 */}
          {/*
          <Tabs.Screen
            name="index"
            options={{
              title: '홈',
              tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            }}
          />
          */}

          <Tabs.Screen
            name="feelings"
            options={{
              title: '감정 기록',
              tabBarIcon: ({ color }) => <TabBarIcon name="smile-o" color={color} />,
            }}
          />

          <Tabs.Screen
            name="tabpost"
            options={{
              title: '게시글',
              tabBarIcon: ({ color }) => <TabBarIcon name="th-large" color={color} />,
            }}
          />
        </Tabs>
      </EmotionProvider>
    </UserContext.Provider>
  );
}
