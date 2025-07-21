import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet} from "react-native";
import { router } from 'expo-router';
import { userAtom } from '@/atoms/userAtom';
import { useAtomValue } from 'jotai';
export default function HomeScreen() {
  const user = useAtomValue(userAtom);

  useEffect(() => {
    if (!user || !user.couple_id) {
      return router.replace('/onboarding');
    }
  }, [user, router]);

  return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 18 }}>LuvTune에 오신 것을 환영해요!</Text>
      <Text style={{ fontSize: 17, color: "#555", marginBottom: 28 }}>오늘 연인과 감정은 어땠나요?</Text>
      <Button title="AI챗" onPress={() => router.push('/chat/aiChat')} />
      <Button title="주간 리포트" onPress={() => router.push('/solution/solution-preview')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
});
