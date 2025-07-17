import { atom } from "jotai";

// 감정 기록 타입 (EmotionContext 참고)
export type BasicEmotion = string;
export type DetailEmotion = string;

export type EmotionRecord = {
  date: string;      // YYYY-MM-DD
  time: string;      // HH:mm:ss
  basic: BasicEmotion;
  details: DetailEmotion[];
  memo?: string;
};

// 날짜별 감정 기록 모음
export const recordsAtom = atom<Record<string, EmotionRecord>>({});

// 오늘 기록 (필요하면 selector로 만들 수 있음)
export const todayRecordAtom = atom((get) => {
  const today = new Date().toISOString().slice(0, 10);
  return get(recordsAtom)[today] || null;
});

// 선택된 날짜 (기본: 오늘)
export const selectedDateAtom = atom<string | null>(new Date().toISOString().slice(0, 10));

// 로딩 상태
export const loadingAtom = atom<boolean>(true);

// 감정 기록 추가/수정용 헬퍼 atom (옵션)
// set(addOrUpdateRecordAtom, newRecord) 하면 바로 recordsAtom이 갱신됨
export const addOrUpdateRecordAtom = atom(
  null,
  (get, set, record: EmotionRecord) => {
    set(recordsAtom, prev => ({
      ...prev,
      [record.date]: record,
    }));
  }
);
