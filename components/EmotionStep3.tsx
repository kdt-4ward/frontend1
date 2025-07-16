import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';

interface Props {
  // 이전 단계에서 선택한 감정 정보 props로 받기
  basicEmotion: { id: string; label: string; color: string };
  detailEmotions: string[];
  onSubmit: (memo: string) => void;
  onBack: () => void;
}

export default function EmotionStep3({ basicEmotion, detailEmotions, onSubmit, onBack }: Props) {
  const [memo, setMemo] = useState("");

  return (
    <View style={styles.container}>
      {/* 상단: 앞에서 고른 감정(캐릭터 + 세부감정) */}
      <View style={styles.selectedWrap}>
        <View style={[styles.circle, { backgroundColor: basicEmotion.color }]}>
          <Text style={styles.emoji}>{basicEmotion.label}</Text>
        </View>
        <View style={styles.detailTags}>
          {detailEmotions.map((em, idx) => (
            <View key={em + idx} style={styles.tag}>
              <Text style={styles.tagText}>{em}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 메모 입력 */}
      <Text style={styles.label}>오늘의 감정에 대해 메모를 남겨보세요</Text>
      <TextInput
        style={styles.input}
        value={memo}
        onChangeText={setMemo}
        placeholder="ex. 오늘 상대방이 따뜻하게 대해줘서 기뻤어요"
        maxLength={120}
        multiline
      />

      {/* 완료 버튼 */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => onSubmit(memo)}
      >
        <Text style={styles.buttonText}>기록 완료</Text>
        <Ionicons name="checkmark" size={22} color="#fff" style={{ marginLeft: 6 }} />
      </TouchableOpacity>

      {/* 뒤로가기 */}
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "#fff", padding: 24, paddingTop: 72,
  },
  selectedWrap: {
    flexDirection: "row", alignItems: "center", marginBottom: 24,
  },
  circle: {
    width: 50, height: 50, borderRadius: 25,
    alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  emoji: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  detailTags: { flexDirection: "row", flexWrap: "wrap" },
  tag: {
    backgroundColor: "#eee", paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 16, marginRight: 6,
  },
  tagText: { color: "#444", fontSize: 13 },
  label: { fontSize: 15, color: "#555", marginBottom: 8, fontWeight: "bold" },
  input: {
    borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12,
    minHeight: 70, fontSize: 15, backgroundColor: "#f9f9f9", marginBottom: 20,
  },
  button: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: "#4077F3", paddingVertical: 12, borderRadius: 24,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  backBtn: {
    position: "absolute", left: 16, top: 36, padding: 8,
  },
});
