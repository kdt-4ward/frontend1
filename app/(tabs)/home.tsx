import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        {"환영합니다\nLuvTune에 오신 걸 환영해요!"}
      </Text>
      <Text style={styles.subtitle}>오늘 연인과 감정은 어땠나요?</Text>
      {/* 여기서 감정 기록/질문/이벤트 등 주요 컴포넌트 배치 */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  welcome: { fontSize: 22, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  subtitle: { fontSize: 16, color: "#888", textAlign: "center" },
});
