// 나중에 image 컴포넌트로 그림 캐릭터로 교체가능

import { BasicEmotion } from "@/atoms/emotionAtoms";


export interface EmotionCharacter {
  id: BasicEmotion;
  label: string;
  imagePath: object;
}

export const emotionCharacters: EmotionCharacter[] = [
  { id: '1', label: '고마운', imagePath: require('@/assets/images/emoticons/1.png') },
  { id: '2', label: '화난', imagePath: require('@/assets/images/emoticons/2.png') },
  { id: '3', label: '슬픈', imagePath: require('@/assets/images/emoticons/3.png') },
  { id: '4', label: '기대', imagePath: require('@/assets/images/emoticons/4.png') },
  { id: '5', label: '행복한', imagePath: require('@/assets/images/emoticons/5.png') },
  { id: '6', label: '미안함', imagePath: require('@/assets/images/emoticons/6.png') },
  { id: '7', label: '사랑', imagePath: require('@/assets/images/emoticons/7.png') },
  { id: '8', label: '설레는', imagePath: require('@/assets/images/emoticons/8.png') },
  { id: '9', label: '서운한', imagePath: require('@/assets/images/emoticons/9.png') },
  { id: '10', label: '그저그런', imagePath: require('@/assets/images/emoticons/10.png') },
  { id: '11', label: '기쁜', imagePath: require('@/assets/images/emoticons/11.png') },
  { id: '12', label: '놀란', imagePath: require('@/assets/images/emoticons/12.png') },
];
