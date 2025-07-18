import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";

export type BasicEmotion = string;
export type DetailEmotion = string;

export type EmotionRecord = {
  date: string;      // YYYY-MM-DD
  time: string;      // HH:mm:ss
  basic: BasicEmotion;
  details: DetailEmotion[];
  memo?: string;
};

type EmotionRecords = Record<string, EmotionRecord>;

interface EmotionContextProps {
  records: EmotionRecords;
  todayRecord: EmotionRecord | null;
  addOrUpdateRecord: (record: EmotionRecord) => void;
  selectedDate: string | null;
  setSelectedDate: (date: string) => void;
  loading: boolean;
}

const EmotionContext = createContext<EmotionContextProps | undefined>(undefined);

export const useEmotionContext = () => {
  const ctx = useContext(EmotionContext);
  if (!ctx) throw new Error("EmotionContext missing");
  return ctx;
};

export const EmotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<EmotionRecords>({});
  const today = new Date().toISOString().slice(0, 10);
  const todayRecord = records[today] || null;
  const [selectedDate, setSelectedDate] = useState<string | null>(today);
  const [loading, setLoading] = useState(true);

  const { userInfo } = useUser();

  useEffect(() => {
    if (!userInfo?.user_id) return;
    setLoading(true);
    fetch(`http://192.168.0.217:8000/emotion/log/${userInfo.user_id}`)
      .then(res => res.json())
      .then(data => {
        const rec: EmotionRecords = {};
        data.forEach((log: any) => {
          const dateStr = log.recorded_at.slice(0, 10);
          rec[dateStr] = {
            date: dateStr,
            time: log.recorded_at.slice(11, 19),
            basic: log.emotion,
            details: log.detail_emotions,
            memo: log.memo,
          };
        });
        setRecords(rec);
        setLoading(false);
      });
  }, []);

  const addOrUpdateRecord = (record: EmotionRecord) => {
    setRecords((prev) => ({
      ...prev,
      [record.date]: record,
    }));
  };

  return (
    <EmotionContext.Provider value={{
      records, todayRecord, addOrUpdateRecord,
      selectedDate, setSelectedDate, loading
    }}>
      {children}
    </EmotionContext.Provider>
  );
};
