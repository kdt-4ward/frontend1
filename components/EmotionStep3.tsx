import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';

interface Props {
  // 이전 단계에서 선택한 감정 정보 props로 받기
  basicEmotion: { id: string; label: string; imagePath: object };
  detailEmotions: string[];
  onSubmit: (memo: string) => void;
}

export default function EmotionStep3({ basicEmotion, detailEmotions, onSubmit }: Props) {
  const [memo, setMemo] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>오늘의 감정에 대해 메모를 남겨보세요</Text>
      {/* 상단: 앞에서 고른 감정(캐릭터 + 세부감정) */}
      <View style={styles.selectedWrap}>
        <View style={styles.circle}>
          <Image source={basicEmotion.imagePath} style={styles.emoji} resizeMode="contain"/>
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
      <TextInput
        style={styles.input}
        value={memo}
        onChangeText={setMemo}
        placeholder="ex. 오늘 00이에게 사랑해라는 말을 들어서 설렜어요."
        maxLength={120}
        multiline
      />

      {/* 완료 버튼 */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => onSubmit(memo)}
      >
        <Text style={styles.buttonText}>기록 완료</Text>
        <Ionicons name="checkmark" size={22} color="#fff" style={{ marginLeft: 6, fontWeight: 800 }} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    textAlign: "center",
    marginBottom: 30,
    color: "#fff",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedWrap: {
    flexDirection: "row", alignItems: "center", marginBottom: 24,
  },
  circle: {
    width: 50, height: 50,
    alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  emoji: { width: 50, height: 50, marginHorizontal: 10, },
  detailTags: { flexDirection: "row", flexWrap: "wrap" },
  tag: {
    backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 10, paddingVertical: 8,
    borderRadius: 16, marginRight: 6,
  },
  tagText: { color: "#fff", fontSize: 14, fontWeight: 600 },
  input: {
    borderRadius: 8, padding: 12, color: '#fff',
    minHeight: 70, fontSize: 16, backgroundColor: "rgba(255,255,255,0.15)", marginBottom: 20,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#7493F7',
    borderRadius: 8,
    marginHorizontal: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#214ee0',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
  },
  backBtn: {
    position: "absolute", left: 16, top: 36, padding: 8,
  },
});
