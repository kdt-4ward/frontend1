import { removeAllTokens } from "../../utils/auth";
import { logout, unlink } from "@react-native-kakao/user";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Button, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useAtomValue, useSetAtom } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { coupleAtom } from '@/atoms/coupleAtom';
import { apiFetch } from '@/utils/api';

export default function MyPage() {
  const router = useRouter();
  const user = useAtomValue(userAtom);
  const coupleInfo = useAtomValue(coupleAtom);
  const setUser = useSetAtom(userAtom);
  const setCouple = useSetAtom(coupleAtom);

  useEffect(() => {
    if (!user) {
      router.replace('/onboarding');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchCoupleInfo = async () => {
      if (user && user.couple_id) {
        const coupleRes = await apiFetch(`/couple/info/${user.couple_id}`);
        if (coupleRes.ok) {
          const coupleInfo = await coupleRes.json();
          setCouple(coupleInfo);
          console.log("커플 연결 성공:", coupleInfo);
        }
      }
    };
    fetchCoupleInfo();
  }, [user, setCouple]);

  const onLogout = async () => {
    try {
      // await logout();
      await removeAllTokens();
      await setUser({});
      await setCouple({});
      console.log("카카오 로그아웃 성공: ");
      router.replace('/onboarding');
    } catch (error) {
      console.error("로그아웃 실패: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileBox}>
        <View style={styles.profileView}>
          <Text>나</Text>
          <Text style={styles.coupleName}>{user?.nickname}</Text>
        </View>
        <Image
          style={{ width: 110, height: 110 }}
          source={require('@/assets/images/splash-icon.png')}
          resizeMode="contain"
        />
        <View style={styles.profileView}>
          <Text>연인</Text>
          {user?.user_id === coupleInfo?.user1?.user_id && (
            <Text style={styles.coupleName}>{coupleInfo?.user2?.nickname}</Text>
          )}
          {user?.user_id === coupleInfo?.user2?.user_id && (
            <Text style={styles.coupleName}>{coupleInfo?.user1?.nickname}</Text>
          )}
        </View>
      </View>
      <View style={styles.dividerThick} />
      <View style={styles.settingsContainer}>
        <Text style={styles.settingsTitle}>정보</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsText}>닉네임 변경하기</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.settingsButton} onPress={onLogout}>
          <Text style={styles.settingsText}>로그아웃</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dividerThick} />
      <View style={styles.settingsContainer}>
        <Text style={styles.settingsTitle}>알림</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsText}>닉네임 변경하기</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.settingsButton} onPress={onLogout}>
          <Text style={styles.settingsText}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  profileBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '70%',
    marginVertical: 40,
  },
  profileView: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  coupleName: {
    fontSize: 22,
    fontWeight: 500,
  },
  settingsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '88%',
    paddingVertical: 22,
  },
  settingsTitle: {
    fontSize: 19,
    fontWeight: 700,
    color: '#1e1e1e',
    marginBottom: 20,
  },
  settingsButton: {
    height: 50,
    justifyContent: 'center',
    width: '100%',
  },
  settingsText: {
    fontSize: 15,
    fontWeight: 400,
    color: '#4b4b4b',
  },
  divider: {
    width: '100%',
    borderWidth: 1,
    borderTopColor: '#eaeaea',
    borderRightColor: '#eaeaea',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  dividerThick: {
    width: '100%',
    height: 5,
    backgroundColor: '#eaeaea',
  },
  button: {
    height: 50,
    backgroundColor: '#7493F7',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '85%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 500,
    color: '#fff',
  },
});
