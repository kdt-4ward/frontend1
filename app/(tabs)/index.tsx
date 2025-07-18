// import React from 'react';
// import { View, Text, SafeAreaView } from 'react-native';
// import CalmStackedBar from '@/components/solution_bar';

// export default function TabHomeScreen() {
//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F6F6' }}>
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
//           Calm 기록
//         </Text>
//         <CalmStackedBar male={45} female={55} />
//       </View>
//     </SafeAreaView>
//   );
// }
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { backendBaseUrl } from '@/constants/app.constants';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/atoms/userAtom';

// 백엔드 API 주소 (예시)

export default function WeeklyStatsScreen() {
  const [data, setData] = useState<any>(null);
  const userInfo = useAtomValue(userAtom);
  const coupleId = '1';
  useEffect(() => {
    // 실제 couple_id로 바꿔서 사용!
    fetch(`http://${backendBaseUrl}/analysis/stats/${coupleId}`)
      .then(res => res.json())
      .then(resJson => {
        setData(resJson);
        console.log('weekly_stats:', resJson); // 콘솔에서도 확인
      })
      .catch(err => {
        console.error('error fetching weekly_stats:', err);
      });
  }, []);

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Weekly Stats 데이터</Text>
      <Text selectable style={{ marginTop: 10, fontSize: 12 }}>
        {data ? JSON.stringify(data, null, 2) : '로딩 중...'}
      </Text>
    </ScrollView>
  );
}
