import { removeAllTokens } from "../../utils/auth";
import { logout, unlink } from "@react-native-kakao/user";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";
import { useAtomValue } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { coupleAtom } from "@/atoms/coupleAtom";

export default function MyPage() {
  const router = useRouter();
  const user = useAtomValue(userAtom);
  const coupleInfo = useAtomValue(coupleAtom);

  if (!user) return router.replace('/onboarding');

  const onLogout = async () => {
    try {
      const res = await logout();
      await removeAllTokens();
      console.log("카카오 로그아웃 성공: ", res);
      router.replace('/onboarding');
    } catch (error) {
      console.error("로그아웃 실패: ", error);
    }
  };

  return (
    <View>
      <View>
        <Text>환영합니다, {user.nickname}님!</Text>
        {user.profile_image && <Image source={{ uri: user.profile_image }} style={styles.profileImage} />}
        <Text>커플ID: {coupleInfo?.couple_id}</Text>
        {user.user_id === coupleInfo?.user1?.user_id && (
          <>
            <Text>상대 연인: {coupleInfo?.user2?.nickname}</Text>
            {coupleInfo?.user2?.profile_image && <Image source={{ uri: coupleInfo.user2.profile_image }} style={styles.profileImage} />}
          </>
        )}
        {user.user_id === coupleInfo?.user2?.user_id && (
          <>
            <Text>상대 연인: {coupleInfo?.user1?.nickname}</Text>
            {coupleInfo?.user1?.profile_image && <Image source={{ uri: coupleInfo.user1.profile_image }} style={styles.profileImage} />}
          </>
        )}
      </View>
      <Button title={'로그아웃'} onPress={onLogout} />
      <Button title={'연결 해제'} onPress={() => {
        unlink().then(() => console.log("연결 해제 성공")).catch(console.error);
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  welcome: { fontSize: 22, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  subtitle: { fontSize: 16, color: "#888", textAlign: "center" },
  input: { width: 260, borderBottomWidth: 1, borderColor: '#bbb', fontSize: 18, marginVertical: 10, padding: 8 },
  button: { width: 300, height: 90, resizeMode: 'contain' },
  copyButton: {
    backgroundColor: '#f6e043',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 18,
    marginTop: 8,
  },
  copyButtonText: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  profileImage: { width: 100, height: 100, objectFit: 'cover', borderRadius: 50 },
});
