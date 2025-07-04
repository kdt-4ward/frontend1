// 나중에 image 컴포넌트로 그림 캐릭터로 교체가능

import { BasicEmotion } from '@/context/EmotionContext';

export interface EmotionCharacter {
  id: BasicEmotion;
  label: string;
  color: string;
}

export const emotionCharacters: EmotionCharacter[] = [
  { id: 'joy', label: '기쁨', color: '#FFD93D' },     // 노랑
  { id: 'anger', label: '화남', color: '#FF6B6B' },   // 빨강
  { id: 'sadness', label: '슬픔', color: '#4D96FF' }, // 파랑
  { id: '1', label: '기대', color: '#FFB347' },
  { id: '2', label: '놀람', color: '#ADFF2F' },
  { id: '3', label: '불안', color: '#C084FC' },
  { id: '4', label: '지루함', color: '#AAAAAA' },
  { id: '5', label: '평온함', color: '#90EE90' },
  { id: '6', label: '피곤함', color: '#B0C4DE' },
];
