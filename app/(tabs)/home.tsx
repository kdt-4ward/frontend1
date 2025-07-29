import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, TextInput, ImageBackground } from "react-native";
import { router } from 'expo-router';
import { userAtom } from '@/atoms/userAtom';
import { useAtomValue, useSetAtom } from 'jotai';
import { coupleAtom } from '@/atoms/coupleAtom';
import { apiFetch } from '@/utils/api';
import { FontAwesome } from '@expo/vector-icons';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function HomeScreen() {
  const user = useAtomValue(userAtom);
    const setCouple = useSetAtom(coupleAtom);

  useEffect(() => {
    if (!user || !user.couple_id) {
      return router.replace('/onboarding');
    }
  }, [user]);

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

  return (
    <ImageBackground
      source={require('@/assets/images/bg5.jpg')}
      resizeMode='cover'
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/screens/solution_preview')}>
          <Image
            style={{ width: 48, height: 48 }}
            source={require('@/assets/images/button-weeklyReport.png')}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/screens/tabpost')}>
          <Image
            style={{ width: 48, height: 48 }}
            source={require('@/assets/images/button-album.png')}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/screens/feelings')}>
          <Image
            style={{ width: 48, height: 48 }}
            source={require('@/assets/images/button-dailyEmotion.png')}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      {/* <View style={styles.floor} /> */}
      <TouchableOpacity style={styles.character} onPress={() => router.push('/screens/aiChat')}>
        <Image
          source={require('@/assets/images/luvy3.png')}
          style={{ width: 120, height: 120 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
      {/* <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 18 }}>LuvTune에 오신 것을 환영해요!</Text>
      <Text style={{ fontSize: 17, color: "#555", marginBottom: 28 }}>오늘 연인과 감정은 어땠나요?</Text> */}
      <View style={styles.messageBox}>
        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => router.push('/screens/aiChat')}
        >
          <Text style={styles.input}>러비에게 답장하기</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/screens/aiChat')}>
          <Image
            style={{ width: 36, height: 36, tintColor: 'rgba(255,255,255,0.5)' }}
            source={require('@/assets/images/icon-send.png')}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#b0deff",
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    position: 'absolute',
    zIndex: 1,
    top: 60,
    display: 'flex',
    flexDirection: 'row-reverse',
    padding: 20,
    gap: 8,
  },
  floor: {
    width: '100%',
    height: 220,
    backgroundColor: '#e9d38b',
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
  },
  character: {
    marginBottom: 24,
    position: 'absolute',
    zIndex: 2,
    bottom: 170,
  },
  sender: {
    fontWeight: "bold",
    marginBottom: 2,
    fontSize: 13
  },
  content: {
    fontSize: 16
  },
  messageBox: {
    position: 'absolute',
    zIndex: 3,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    marginBottom: 80,
  },
  inputBox: {
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 20,
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginRight: 6,
  },
  input: {
    color: '#7c7c7c',
    fontSize: 16,
  },
});
