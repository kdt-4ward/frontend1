import React, { useEffect } from "react";
import { Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { userAtom } from "@/atoms/userAtom";
import { apiFetch } from "@/utils/api";

export default function CoupleWaitScreen() {
  const user = useAtomValue(userAtom);
  const setUser = useSetAtom(userAtom);
  const router = useRouter();

  useEffect(() => {
    if (!user?.user_id) return;
    const interval = setInterval(async () => {
      const res = await apiFetch('/auth/me', { method: 'GET' });
      if (res.ok) {
        const userInfo = await res.json();
        // couple_id가 새로 생기면 → 연결 성공!
        if (userInfo.couple_id && !user.couple_id) {
          setUser(userInfo);
          Alert.alert("커플 연결 성공!", "상대방과 연결이 완료되었습니다.", [
            { text: "확인", onPress: () => router.replace('/(tabs)/home') }
          ]);
          clearInterval(interval); // 폴링 종료
        }
      }
    }, 4000); // 4초마다 확인
    return () => clearInterval(interval);
  }, [user?.user_id]);

  return (
    // ... 기존 커플코드 생성/입력 UI
    <Text>상대방의 연결을 기다리고 있습니다...</Text>
  );
}
