// import { StyleSheet } from 'react-native';
// import Google_login from '../../components/Google_login';
// import EditScreenInfo from '@/components/EditScreenInfo';
// import { Text, View } from '@/components/Themed';
// import Chat from '@/components/Chat';
// import React, { useState } from 'react';

// export default function TabOneScreen() {
//   const [userInfo, setUserInfo] = useState<null | {
//     user_id: string;
//     name: string;
//     email: string;
//   }>(null);
  
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Tab One</Text>
//       <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
//       {/* ✅ 로그인 성공 전이면 로그인 버튼 보여주고, 성공하면 채팅 화면 보여줌 */}
//       {userInfo ? <Chat userId={userInfo.user_id} /> : <Google_login onLoginSuccess={setUserInfo} />}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   separator: {
//     marginVertical: 30,
//     height: 1,
//     width: '80%',
//   },
// });
import { StyleSheet } from 'react-native';
import Google_login from '../../components/Google_login';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import Chat from '@/components/Chat';
import React, { useContext } from 'react';
import { UserContext } from './_layout'; // ✅ 상대 경로 꼭 맞춰야 해

export default function TabOneScreen() {
  const { userInfo, setUserInfo } = useContext(UserContext); // ✅ 전역 상태에서 꺼냄

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {userInfo ? (
        <Chat userId={userInfo.user_id} />
      ) : (
        <Google_login onLoginSuccess={setUserInfo} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
