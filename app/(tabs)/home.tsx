import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from "react-native";
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
    <View style={styles.container}>
      <View style={styles.floor} />
      <TouchableOpacity style={styles.character} onPress={() => router.push('/screens/aiChat')}>
        <Image
          source={require('@/assets/images/luvy.png')}
          style={{ width: 140, height: 140 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.calendar} onPress={() => router.push('/screens/feelings')}>
        <Image
          style={{ width: 140, height: 140 }}
          source={require('@/assets/images/calendar.png')}
          resizeMode="contain"
        />
      </TouchableOpacity>
      {/* <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 18 }}>LuvTune에 오신 것을 환영해요!</Text>
      <Text style={{ fontSize: 17, color: "#555", marginBottom: 28 }}>오늘 연인과 감정은 어땠나요?</Text> */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/screens/solution_preview')}>
          <TabBarIcon name={'file-text'} color={'#7493F7'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/screens/tabpost')}>
          <TabBarIcon name={'file-picture-o'} color={'#7493F7'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E2F3FF",
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    position: 'absolute',
    zIndex: 1,
    top: 0,
    display: 'flex',
    flexDirection: 'row-reverse',
    padding: 20,
    gap: 15,
  },
  floor: {
    width: '100%',
    height: 220,
    backgroundColor: '#F7F0D9',
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
  },
  character: {
    width: 140,
    height: 140,
    marginBottom: 24,
    position: 'absolute',
    zIndex: 2,
    bottom: 130,
  },
  calendar: {
    position: 'absolute',
    zIndex: 1,
    top: 150,
    left: 35,
  },
});
