import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Svg, { G, Circle, Text as SvgText } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import { AnimatedCircle, AnimatedG } from '@/utils/animatedSvg';
import { makeBubbleChartData } from '@/utils/Chart_test_data';

type BubbleChartProps = {
  weeklyData: any; // 주간 통계 데이터(json)
};

export default function BubbleChart({ weeklyData }: BubbleChartProps) {
  // ⚡️ 1. 데이터 변환
  const emotions = makeBubbleChartData(weeklyData);

  // ⚡️ 2. 애니메이션 state 선언 (버블 개수는 4개로 고정)
  const animatedRadii = [
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
  ];
  const opacities = [
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
  ];

  const animatedCircleProps = [
    useAnimatedProps(() => ({ r: 40 + animatedRadii[0].value * 1.3 })),
    useAnimatedProps(() => ({ r: 40 + animatedRadii[1].value * 1.3 })),
    useAnimatedProps(() => ({ r: 40 + animatedRadii[2].value * 1.3 })),
    useAnimatedProps(() => ({ r: 40 + animatedRadii[3].value * 1.3 })),
  ];

  const animatedGroupProps = [
    useAnimatedProps(() => ({ opacity: opacities[0].value })),
    useAnimatedProps(() => ({ opacity: opacities[1].value })),
    useAnimatedProps(() => ({ opacity: opacities[2].value })),
    useAnimatedProps(() => ({ opacity: opacities[3].value })),
  ];

  // ⚡️ 3. 애니메이션 효과
  useEffect(() => {
    emotions.forEach((_, i) => {
      setTimeout(() => {
        animatedRadii[i].value = withTiming(emotions[i].percent, { duration: 1000 });
        opacities[i].value = withTiming(0.85, { duration: 700 });
      }, i * 500);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(emotions)]);

  const { width } = Dimensions.get('window');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>주간 리포트</Text>
      <Text style={styles.subtitle}>상위 감정 통계(합산 기준)</Text>
      <Svg height="260" width={width}>
        {emotions.map((e, i) => (
          // @ts-ignore
          <AnimatedG key={e.id} animatedProps={animatedGroupProps[i]}>
            <AnimatedCircle
              cx={e.x}
              cy={e.y}
              animatedProps={animatedCircleProps[i]}
              fill={e.color}
            />
            <SvgText
              x={e.x}
              y={e.y + 5}
              fontSize="18"
              fill="#fff"
              fontWeight="bold"
              textAnchor="middle"
            >
              {e.percent}%
            </SvgText>
          </AnimatedG>
        ))}
      </Svg>
      <View style={{ marginTop: 20 }}>
        {emotions.map((e) => (
          <View key={e.id} style={styles.legendRow}>
            <View style={[styles.colorDot, { backgroundColor: e.color }]} />
            <Text style={styles.legendText}>
              {e.label} - {e.percent}%
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { color: '#888', marginBottom: 16 },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  colorDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  legendText: { fontSize: 14 },
});

