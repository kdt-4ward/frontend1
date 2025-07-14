import { logout, unlink } from "@react-native-kakao/user";
import React from "react";
import { View, Text, Button } from "react-native";

export default function MyPage() {

  return (
    <View>
      <Text></Text>
      {/* 프로필 업데이트 UI도 필요시 추가 */}
      <Button title={'로그아웃'} onPress={async () => {
        try {
          const res = await logout();
          console.log("카카오 로그아웃 성공: ", res);
        } catch (error) {
          console.error(error);
        }
      }} />
      <Button title={'연결 해제'} onPress={() => {
        unlink().then(console.log).catch(console.error);
      }} />
    </View>
  );
}
