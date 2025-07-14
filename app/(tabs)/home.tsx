import { login, me } from "@react-native-kakao/user";
import React, { useState } from "react";
import { Button, View, Text, StyleSheet, Image } from "react-native";

export default function HomeScreen() {
  const [userName, setUserName] = useState('');
  const [userProfile, setUserProfile] = useState('');

  const onKakaoLogin = async () => {
    try {
      const res = await login();
      console.log("카카오 로그인 성공: ", res);
      const userInfo = await me();
      setUserName(userInfo?.nickname);
      setUserProfile(userInfo?.profileImageUrl);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        {"환영합니다\nLuvTune에 오신 걸 환영해요!"}
      </Text>
      <Text style={styles.subtitle}>오늘 연인과 감정은 어땠나요?</Text>
      {/* 여기서 감정 기록/질문/이벤트 등 주요 컴포넌트 배치 */}
      {userName ? (
        <View>
          <Text>로그인한 사용자: {userName}</Text>
          {userProfile && <Image source={{ uri: userProfile }} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 50 }} />}
        </View>
      ) : (
        <Button title={'카카오 로그인'} onPress={onKakaoLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  welcome: { fontSize: 22, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  subtitle: { fontSize: 16, color: "#888", textAlign: "center" },
});
