import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import StackedBarChart from '@/components/solutions/stacked_bar_chart';
import BubbleChart from '@/components/solutions/bubleChart'; // ✅ 버블차트 컴포넌트 import
import WeeklySummaryTabs from '@/components/solutions/WeeklySummaryTabs';
// 임시 test 데이터 실제 배포 시 삭제
import weeklyData from '@/test_data/weekly_solution_test.json'; // 실제 파일 위치에 맞게 import
import { makeStackedBarChartData } from '@/utils/Chart_test_data';

export default function SolutionPreviewScreen() {
  const data1 = [
    { label: '애정표현', value: 4, color: '#F47C7C' },
    { label: '배려', value: 3, color: '#FFD56F' },
    { label: '적극성', value: 2, color: '#A1DE93' },
    { label: '갈등', value: 1, color: '#6A67CE' },
  ];

  const data2 = [
    { label: '애정표현', value: 3, color: '#F47C7C' },
    { label: '배려', value: 2, color: '#FFD56F' },
    { label: '적극성', value: 1, color: '#A1DE93' },
    { label: '갈등', value: 5, color: '#6A67CE' },
  ];

  const data3 = [
    { label: '애정표현', value: 1, color: '#F47C7C' },
    { label: '배려', value: 1, color: '#FFD56F' },
    { label: '적극성', value: 1, color: '#A1DE93' },
    { label: '갈등', value: 1, color: '#6A67CE' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 🟣 버블차트 영역 */}
      <BubbleChart weeklyData={weeklyData} />

      {/* 🟦 막대그래프 3개 */}
      <Text style={[styles.heading, { marginTop: 40 }]}>감정 표현 분석</Text>
      <StackedBarChart title="유저 1 감정 비율" data={makeStackedBarChartData(weeklyData, 'user_1')} />
      <StackedBarChart title="유저 2 감정 비율" data={makeStackedBarChartData(weeklyData, 'user_2')} />
      <StackedBarChart title="전체 합산 감정 비율" data={makeStackedBarChartData(weeklyData, 'total')} />
      <WeeklySummaryTabs/>
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
