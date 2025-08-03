import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from "react-native";
import BottomBlurModal from "@/components/BottomBlurModal";
import { recordsAtom, addOrUpdateRecordAtom } from "@/atoms/emotionAtoms";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/userAtom";
import { backendBaseUrl } from "@/constants/app.constants";
import { emotionCharacters } from "@/constants/emotionCharacters";
import EmotionStep1 from "@/components/EmotionStep1";
import EmotionStep2 from "@/components/EmotionStep2";
import EmotionStep3 from "@/components/EmotionStep3";
import { Ionicons } from "@expo/vector-icons";


interface EmotionRecordModalProps {
  visible: boolean;
  onClose: () => void;
  editDate?: string;
}

export default function EmotionRecordModal({ visible,  onClose, editDate }: EmotionRecordModalProps) {
  const [records] = useAtom(recordsAtom);
  const [, addOrUpdateRecord] = useAtom(addOrUpdateRecordAtom);

  // 수정모드면 해당 날짜 기록, 아니면 오늘 날짜 기록
  const date = editDate ?? new Date().toISOString().slice(0, 10);
  const baseRecord = records[date];

  const [selectedCharacter, setSelectedCharacter] = useState<null | { id: string; label: string; imagePath: object }>(
    baseRecord
      ? emotionCharacters.find((c) => c.id === baseRecord.basic) ?? null
      : null
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(baseRecord ? baseRecord.details : []);
  const [step, setStep] = useState(1);
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
  }, [editDate, records]);

  const [userInfo] = useAtom(userAtom);

  // 1단계 캐릭터 선택
  const handleCharacterSelect = (character: { id: string; label: string; imagePath: object }) => {
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
      await fetch(`${backendBaseUrl}/emotion/log`, {
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

    if (onClose) onClose();
  };

  const handlePressBackBtn = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  return (
    <BottomBlurModal visible={visible} onClose={onClose}>
      <View style={{width: '100%', height: 30, marginBottom: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <TouchableOpacity disabled={step === 1} onPress={handlePressBackBtn} style={{opacity: step === 1 && 0}}>
          <Ionicons name="arrow-back" size={25} color={'#fff'} />
        </TouchableOpacity>
        <View style={{width: 90, height: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)'}}>
          <View style={{width: 30 * step, height: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.5)'}}></View>
        </View>
        <TouchableOpacity
          onPress={onClose}
          style={{width: 25, }}
        >
          <Ionicons name="close" size={25} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {step === 1 || !selectedCharacter ? (
          <EmotionStep1
            onSelect={handleCharacterSelect}
            initialSelected={selectedCharacter?.id}
          />
        ) : step === 2 ? (
          <EmotionStep2
            onSubmit={handleTagSubmit}
            initialSelected={selectedTags}
          />
        ) : (
          <EmotionStep3
            basicEmotion={selectedCharacter}
            detailEmotions={selectedTags}
            onSubmit={handleMemoSubmit}
          />
        )}
      </View>
    </BottomBlurModal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 450,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  blurWrap: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.5)",
    paddingBottom: 26,
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  content: {
    alignItems: "center",
  },
  closeBtn: {
    marginTop: 22,
    paddingVertical: 10,
    paddingHorizontal: 32,
    backgroundColor: "#ECECFA",
    borderRadius: 16,
    alignSelf: "center",
  }
});
