
import React, { useState, useEffect } from "react";
import EmotionStep1 from "./EmotionStep1";
import EmotionStep2 from "./EmotionStep2";
import { useEmotionContext } from "../context/EmotionContext";
import { emotionCharacters } from "../constants/emotionCharacters";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useUser } from "../context/UserContext";

interface Props {
  onComplete?: () => void;
  editDate?: string;
}

export default function EmotionRecordFlow({ onComplete, editDate }: Props) {
  const { records, addOrUpdateRecord } = useEmotionContext();

  // 수정모드면 해당 날짜 기록, 아니면 오늘 날짜 기록
  const date = editDate ?? new Date().toISOString().slice(0, 10);
  const baseRecord = records[date];

  const [selectedCharacter, setSelectedCharacter] = useState<null | { id: string; label: string; color: string }>(
    baseRecord
      ? emotionCharacters.find((c) => c.id === baseRecord.basic) ?? null
      : null
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(baseRecord ? baseRecord.details : []);
  const [step, setStep] = useState<1 | 2>(1);

  // editDate 바뀔 때마다 값/스텝 초기화
  useEffect(() => {
    setStep(1);
    if (baseRecord) {
      setSelectedTags(baseRecord.details);
      setSelectedCharacter(emotionCharacters.find((c) => c.id === baseRecord.basic) ?? null);
    } else {
      setSelectedTags([]);
      setSelectedCharacter(null);
    }
  }, [editDate]);

  const handleCharacterSelect = (character: { id: string; label: string; color: string }) => {
    setSelectedCharacter(character);
    setStep(2);
  };
  const { userInfo } = useUser();

  const handleTagSubmit = async (tags: string[]) => {
    if (!selectedCharacter || !userInfo) return;
  
    const now = new Date();
    const time = now.toTimeString().slice(0, 8);
    const recordedAt = new Date(`${date}T00:00:00`);
  
    // ✅ 서버로 감정 기록 전송
    try {
      await fetch("http://192.168.0.217:8000/emotion/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userInfo.user_id,
          couple_id: userInfo.couple_id,
          emotion: selectedCharacter.id,
          detail_emotions: tags,
          recorded_at: recordedAt.toISOString(),
        }),
      });
    } catch (err) {
      console.error("서버 저장 실패", err);
      alert("서버에 감정 기록 저장 실패");
    }
  
    // ✅ 로컬 상태에도 반영
    addOrUpdateRecord({
      date,
      time,
      basic: selectedCharacter.id,
      details: tags,
    });
  
    if (onComplete) onComplete();
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#fff" }}>
      {/* X(닫기) 버튼만 항상 */}
      <TouchableOpacity
        onPress={onComplete}
        style={{
          position: "absolute",
          left: 20,
          top: 44,
          zIndex: 10,
          padding: 4,
        }}
        hitSlop={10}
      >
        <Ionicons name="close" size={28} color="#222" />
      </TouchableOpacity>
      {step === 1 || !selectedCharacter
        ? <EmotionStep1
            onSelect={handleCharacterSelect}
            initialSelected={selectedCharacter?.id}
            onCancel={onComplete}
          />
        : <EmotionStep2
            onSubmit={handleTagSubmit}
            initialSelected={selectedTags}
            onCancel={onComplete}
          />
      }
    </View>
  );
}
