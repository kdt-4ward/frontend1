// 나중에 image 컴포넌트로 그림 캐릭터로 교체가능

import { BasicEmotion } from "@/atoms/emotionAtoms";


export interface EmotionCharacter {
  id: BasicEmotion;
  label: string;
  color: string;
}

export const emotionCharacters: EmotionCharacter[] = [
  { id: '1', label: '고마운', color: '#FFD93D' },     // 노랑
  { id: '2', label: '화난', color: '#FF6B6B' },   // 빨강
  { id: '3', label: '슬픈', color: '#4D96FF' }, // 파랑
  { id: '4', label: '기대', color: '#FFB347' },
  { id: '5', label: '행복한', color: '#ADFF2F' },
  { id: '6', label: '미안함', color: '#C084FC' },
  { id: '7', label: '사랑', color: '#AAAAAA' },
  { id: '8', label: '친밀감', color: '#90EE90' },
  { id: '9', label: '서운한', color: '#B0C4DE' },
];
