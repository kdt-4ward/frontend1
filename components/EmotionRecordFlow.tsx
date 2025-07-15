
import React, { useState, useEffect } from "react";
import EmotionStep1 from "./EmotionStep1";
import EmotionStep2 from "./EmotionStep2";
import EmotionStep3 from "./EmotionStep3";
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
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [memo, setMemo] = useState(baseRecord?.memo ?? ""); // 메모 상태

  useEffect(() => {
    setStep(1);
    if (baseRecord) {
      setSelectedTags(baseRecord.details);
      setSelectedCharacter(emotionCharacters.find((c) => c.id === baseRecord.basic) ?? null);
      setMemo(baseRecord.memo ?? "");
    } else {
      setSelectedTags([]);
      setSelectedCharacter(null);
      setMemo("");
    }
  }, [editDate]);

  const { userInfo } = useUser();

  // 1단계 캐릭터 선택
  const handleCharacterSelect = (character: { id: string; label: string; color: string }) => {
    setSelectedCharacter(character);
    setStep(2);
  };

  // 2단계 태그 선택 완료
  const handleTagSubmit = (tags: string[]) => {
    setSelectedTags(tags);
    setStep(3);
  };

  // 3단계 메모 입력 완료 → 서버/로컬 저장
  const handleMemoSubmit = async (memoText: string) => {
    if (!selectedCharacter || !userInfo) return;

    const now = new Date();
    const time = now.toTimeString().slice(0, 8);
    const recordedAt = `${date} 00:00:00`; // 문자열로 보냄!

    try {
      await fetch("http://192.168.0.217:8000/emotion/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userInfo.user_id,
          couple_id: userInfo.couple_id,
          emotion: selectedCharacter.id,
          detail_emotions: selectedTags,
          memo: memoText, // memo 필드 전달
          recorded_at: recordedAt,
        }),
      });
    } catch (err) {
      console.error("서버 저장 실패", err);
      alert("서버에 감정 기록 저장 실패");
    }

    // 로컬 상태 업데이트 (EmotionRecord 타입에 memo도 추가)
    addOrUpdateRecord({
      date,
      time,
      basic: selectedCharacter.id,
      details: selectedTags,
      memo: memoText,
    });

    if (onComplete) onComplete();
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#fff" }}>
    {/* X(닫기) 버튼: step이 3이 아닐 때만 보여줌 */}
    {step === 1 && (
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
    )}
    {step === 1 || !selectedCharacter ? (
      <EmotionStep1
        onSelect={handleCharacterSelect}
        initialSelected={selectedCharacter?.id}
        onCancel={onComplete}
      />
    ) : step === 2 ? (
      <EmotionStep2
        onSubmit={handleTagSubmit}
        initialSelected={selectedTags}
        onCancel={onComplete}
        onBack={()=> setStep(1)}
      />
    ) : (
      <EmotionStep3
        basicEmotion={selectedCharacter}
        detailEmotions={selectedTags}
        onSubmit={handleMemoSubmit}
        onBack={() => setStep(2)}
      />
    )}
  </View>
);
}
