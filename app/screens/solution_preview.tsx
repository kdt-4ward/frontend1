
import React, { useEffect, useState} from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import StackedBarChart from '@/components/solutions/stacked_bar_chart';
import BubbleChart from '@/components/solutions/bubleChart'; 
import WeeklySummaryTabs from '@/components/solutions/WeeklySummaryTabs';
import { makeStackedBarChartData } from '@/utils/Chart_test_data';
import { apiFetch } from '@/utils/api'; 
import { useAtomValue } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { coupleAtom } from '@/atoms/coupleAtom';
import Recommendations from '@/components/solutions/Recommendations';
import WeeklyAdviceTabs from '@/components/solutions/WeeklyAdvice';


// 임시 test 데이터 실제 배포 시 삭제
// import weeklyData from '@/test_data/weekly_solution_test.json'; // 실제 파일 위치에 맞게 import

export default function SolutionPreviewScreen() {
  const user = useAtomValue(userAtom);
  const couple = useAtomValue(coupleAtom);
  const [weeklyData, setWeeklyData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.couple_id) return;
    setLoading(true);
    apiFetch(`/analysis/stats/${user.couple_id}?end_date=2025-08-03`)
      .then(res => res.json())
      .then(data => {
        // console.log('응답 데이터:', data);
        // console.log(data.user_stats);
        setWeeklyData(data); // weekly_stats 객체 전체 저장
      })
      .catch(e => console.error('주간 분석 통계 데이터 불러오기 실패', e))
      .finally(() => setLoading(false));
  }, [user?.couple_id]);
  console.log(user.couple_id);

  if (loading || !weeklyData) return <Text>로딩 중...</Text>;
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BubbleChart weeklyData={weeklyData} />
      <Text style={[styles.heading, { marginTop: 40 }]}>감정 표현 분석</Text>
      <StackedBarChart title={`${couple.user1.nickname}의 감정 비율`} data={makeStackedBarChartData(weeklyData, couple.user1.user_id)} />
      <StackedBarChart title={`${couple.user2.nickname}의 감정 비율`} data={makeStackedBarChartData(weeklyData, couple.user2.user_id)} />
      {/* <StackedBarChart title="전체 합산 감정 비율" data={makeStackedBarChartData(weeklyData, 'total')} /> */}
      <Recommendations />
      <WeeklySummaryTabs />
      {/* <WeeklyAdviceTabs /> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});