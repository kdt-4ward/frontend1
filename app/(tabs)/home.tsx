import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet} from "react-native";
import { router } from 'expo-router';
import { userAtom } from '@/atoms/userAtom';
import { useAtomValue, useSetAtom } from 'jotai';
import { coupleAtom } from '@/atoms/coupleAtom';
import { apiFetch } from '@/utils/api';

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
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 18 }}>LuvTune에 오신 것을 환영해요!</Text>
      <Text style={{ fontSize: 17, color: "#555", marginBottom: 28 }}>오늘 연인과 감정은 어땠나요?</Text>
      <Button title="AI챗" onPress={() => router.push('/screens/aiChat')} />
      <Button title="감정 기록" onPress={() => router.push('/screens/feelings')} />
      <Button title="게시글 작성" onPress={() => router.push('/screens/tabpost')} />
      <Button title="솔루션" onPress={() => router.push('/screens/solution_preview')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
});
