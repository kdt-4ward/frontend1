
// export const EMOTION_LABELS: Record<string, string> = {
//   affection: '애정표현',
//   consideration: '배려',
//   initiative: '적극성',
//   encouragement: '격려',
//   conflict: '갈등',
// };

// const COLORS = ['#79366F', '#C87BAA', '#EAC7DA', '#F7D9E5'];
// const DEFAULT_X = [100, 250, 210, 310];
// const DEFAULT_Y = [130, 90, 200, 190];

// // json: 백엔드에서 온 user_1, user_2 구조
// export function makeBubbleChartData(json: any) {
//   const emotionKeys = Object.keys(EMOTION_LABELS);

//   const combined = emotionKeys.map((key) => {
//     // count가 배열이면 합산, 아니면 0 처리
//     const arr1 = Array.isArray(json.user_1?.[key]?.count)
//       ? json.user_1[key].count
//       : [json.user_1?.[key]?.count || 0];
//     const arr2 = Array.isArray(json.user_2?.[key]?.count)
//       ? json.user_2[key].count
//       : [json.user_2?.[key]?.count || 0];

//     const v1 = arr1.reduce((a, b) => a + b, 0);
//     const v2 = arr2.reduce((a, b) => a + b, 0);

//     return {
//       key,
//       count: v1 + v2,
//       label: EMOTION_LABELS[key],
//     };
//   });

//   // count 기준 내림차순 상위 4개
//   const top4 = combined
//     .sort((a, b) => b.count - a.count)
//     .slice(0, 4);
//   const total = top4.reduce((sum, e) => sum + e.count, 0);

//   return top4.map((e, i) => ({
//     id: (i + 1).toString(),
//     percent: total > 0 ? Math.round((e.count / total) * 100) : 0,
//     color: COLORS[i % COLORS.length],
//     label: e.label,
//     x: DEFAULT_X[i],
//     y: DEFAULT_Y[i],
//     count: e.count // 디버깅/확인용(필요없으면 제거)
//   }));
// }

// // 막대대차트 색상(5개)
// export const EMOTION_COLORS = ['#79366F', '#C87BAA', '#EAC7DA', '#F7D9E5', '#A3A1F7'];

// // user: 'user_1' | 'user_2' | 'total'
// export function makeStackedBarChartData(weeklyData: any, userKey: string) {
//   const keys = Object.keys(EMOTION_LABELS); // emotion code 리스트(순서 고정)
//   return keys.map((emotion, idx) => ({
//     label: EMOTION_LABELS[emotion],
//     value: userKey === 'total'
//       ? (weeklyData.user_1?.[emotion]?.count || 0) + (weeklyData.user_2?.[emotion]?.count || 0)
//       : (weeklyData[userKey]?.[emotion]?.count || 0),
//     color: EMOTION_COLORS[idx] // 5가지 색상 순서대로
//   }));
// }

export const EMOTION_LABELS: Record<string, string> = {
  affection: '애정표현',
  empathy: '배려',
  initiative: '적극성',
  encouragement: '격려',
  conflict: '갈등',
};

const COLORS = ['#79366F', '#C87BAA', '#EAC7DA', '#F7D9E5'];
const DEFAULT_X = [100, 250, 210, 310];
const DEFAULT_Y = [130, 90, 200, 190];

// json: 백엔드에서 온 user_stats 구조
export function makeBubbleChartData(json: any) {
  const emotionKeys = Object.keys(EMOTION_LABELS);

  // 실제 user id는 "1", "2"로 옴
  const userIds = Object.keys(json.user_stats || {});
  if (userIds.length < 2) return []; // 데이터 없을 때

  const combined = emotionKeys.map((key) => {
    const v1 = json.user_stats["1"]?.[key]?.total_count || 0;
    const v2 = json.user_stats["2"]?.[key]?.total_count || 0;
    return {
      key,
      count: v1 + v2,
      label: EMOTION_LABELS[key],
    };
  });

  // count 기준 내림차순 상위 4개
  const top4 = combined
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
  const total = top4.reduce((sum, e) => sum + e.count, 0);

  return top4.map((e, i) => ({
    id: (i + 1).toString(),
    percent: total > 0 ? Math.round((e.count / total) * 100) : 0,
    color: COLORS[i % COLORS.length],
    label: e.label,
    x: DEFAULT_X[i],
    y: DEFAULT_Y[i],
    count: e.count // 디버깅/확인용(필요없으면 제거)
  }));
}

export const EMOTION_COLORS = ['#79366F', '#C87BAA', '#EAC7DA', '#F7D9E5', '#A3A1F7'];

// userKey: '1' | '2' | 'total'
export function makeStackedBarChartData(weeklyData: any, userKey: string) {
  const keys = Object.keys(EMOTION_LABELS); // 감정 리스트
  return keys.map((emotion, idx) => ({
    label: EMOTION_LABELS[emotion],
    value:
      userKey === 'total'
        ? ((weeklyData.user_stats?.["1"]?.[emotion]?.total_count || 0) +
           (weeklyData.user_stats?.["2"]?.[emotion]?.total_count || 0))
        : (weeklyData.user_stats?.[userKey]?.[emotion]?.total_count || 0),
    color: EMOTION_COLORS[idx],
  }));
}
