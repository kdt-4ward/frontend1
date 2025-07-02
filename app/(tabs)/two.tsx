
import { StyleSheet } from 'react-native';
import Chat from '@/components/Chat';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import React, { useContext } from 'react';
import { UserContext } from './_layout'; // ✅ Context에서 로그인 정보 가져오기

export default function TabTwoScreen() {
  const { userInfo } = useContext(UserContext); // ✅ userInfo 상태 받아오기

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <EditScreenInfo path="app/(tabs)/two.tsx" />

      {/* ✅ 로그인 여부에 따라 채팅 화면 보여주기 */}
      {userInfo ? (
        <Chat userId={userInfo.user_id} />
      ) : (
        <Text style={{ marginTop: 20 }}>로그인이 필요합니다.</Text>
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
