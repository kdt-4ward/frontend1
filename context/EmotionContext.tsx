import React, { createContext, useContext, useState } from "react";

// 타입 정의
export type BasicEmotion = string;
export type DetailEmotion = string;

export type EmotionRecord = {
  date: string;      // YYYY-MM-DD
  time: string;      // HH:mm:ss
  basic: BasicEmotion;           // 1단계에서 선택한 감정 캐릭터 id
  details: DetailEmotion[];      // 2단계에서 선택한 감정 태그 label (최대 3개)
};

type EmotionRecords = Record<string, EmotionRecord>; // 날짜별로 기록 저장

// Context Props 정의
interface EmotionContextProps {
  records: EmotionRecords;                        // 전체 기록
  todayRecord: EmotionRecord | null;              // 오늘 기록
  addOrUpdateRecord: (record: EmotionRecord) => void; // 기록 추가/수정
  selectedDate: string | null;                    // 선택한 날짜
  setSelectedDate: (date: string) => void;        // 날짜 선택 setter
}

// Context 생성
const EmotionContext = createContext<EmotionContextProps | undefined>(undefined);

// Context Custom Hook
export const useEmotionContext = () => {
  const ctx = useContext(EmotionContext);
  if (!ctx) throw new Error("EmotionContext missing");
  return ctx;
};

// Provider 구현
export const EmotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<EmotionRecords>({});
  const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
  const todayRecord = records[today] || null;
  const [selectedDate, setSelectedDate] = useState<string | null>(today);

  const addOrUpdateRecord = (record: EmotionRecord) => {
    setRecords((prev) => ({
      ...prev,
      [record.date]: record,
    }));
  };

  return (
    <EmotionContext.Provider value={{
      records, todayRecord, addOrUpdateRecord,
      selectedDate, setSelectedDate
    }}>
      {children}
    </EmotionContext.Provider>
  );
};
