// 감정 태그 모음 

export interface EmotionTag {
    label: string;
    color: string;
  }
  
  export const emotionTags: EmotionTag[] = [
    // ✅ 긍정 감정 (진한 노랑/초록 계열)
    { label: '사랑받는', color: '#FFD700' },   // Gold
    { label: '고마운', color: '#E6B800' },     // 진한 연노랑
    { label: '설레는', color: '#FFB300' },     // 주황빛 노랑
    { label: '안심되는', color: '#D4AF37' },   // 진한 금색
    { label: '따뜻한', color: '#FFA500' },     // 오렌지
    { label: '행복한', color: '#FFCC00' },     // 해바라기 노랑
    { label: '든든한', color: '#9ACD32' },     // 올리브 그린
    { label: '이해받는', color: '#228B22' },   // 포레스트 그린
    { label: '함께하는', color: '#2E8B57' },   // 진한 청록
    { label: '친밀한', color: '#3CB371' },     // 미디엄 시그린
    { label: '감동한', color: '#6B8E23' },     // 올리브 드랩
    { label: '배려받는', color: '#006400' },   // 다크 그린
    { label: '즐거운', color: '#008000' },     // 그린
    { label: '믿음직한', color: '#556B2F' },   // 다크 올리브
    { label: '유쾌한', color: '#006400' },     // 다크 그린
  
    // ❌ 부정 감정 (진한 빨강~보라~파랑 계열)
    { label: '서운한', color: '#B22222' },     // 파이어브릭
    { label: '외로운', color: '#8B0000' },     // 다크레드
    { label: '불안한', color: '#800000' },     // 마룬
    { label: '답답한', color: '#A52A2A' },     // 브라운
    { label: '지친', color: '#5A3E36' },       // 다크 브라운
    { label: '질투난', color: '#8B008B' },     // 다크 마젠타
    { label: '무시당한', color: '#9400D3' },   // 다크 바이올렛
    { label: '오해받은', color: '#8A2BE2' },   // 블루바이올렛
    { label: '거리감 느낀', color: '#4B0082' },// 인디고
    { label: '냉랭한', color: '#483D8B' },     // 다크 슬레이트 블루
    { label: '소외된', color: '#4169E1' },     // 로열 블루
    { label: '소홀한', color: '#00008B' },     // 다크 블루
    { label: '부담스런', color: '#191970' },   // 미드나잇 블루
    { label: '억울한', color: '#2F4F4F' },     // 다크 슬레이트 그레이
    { label: '눈치보는', color: '#1E90FF' }    // 도저 블루
  ];
  