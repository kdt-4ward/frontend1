
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Svg, { G, Circle, Text as SvgText } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

const rawEmotions = [
  { id: 'calm', percent: 51, color: '#79366F', label: 'Feel calm', x: 110, y: 130 },
  { id: 'anxiety', percent: 35, color: '#C87BAA', label: 'Slight anxiety', x: 260, y: 90 },
  { id: 'excitement', percent: 15, color: '#EAC7DA', label: 'Excitement', x: 220, y: 200 },
  { id: 'stress', percent: 7, color: '#F7D9E5', label: 'Stress', x: 320, y: 190 },
];

export default function SolutionPreviewScreen() {
  const emotions = [...rawEmotions].sort((a, b) => b.percent - a.percent);

  // (1) map 안에서 쓰지 말고, 직접 선언
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

  // (2) animatedProps도 map 안이 아니라 배열로 생성
  const animatedCircleProps = [
    useAnimatedProps(() => ({
      r: 40 + animatedRadii[0].value * 1.4,
    })),
    useAnimatedProps(() => ({
      r: 40 + animatedRadii[1].value * 1.4,
    })),
    useAnimatedProps(() => ({
      r: 40 + animatedRadii[2].value * 1.4,
    })),
    useAnimatedProps(() => ({
      r: 40 + animatedRadii[3].value * 1.4,
    })),
  ];

  const animatedGroupProps = [
    useAnimatedProps(() => ({
      opacity: opacities[0].value,
    })),
    useAnimatedProps(() => ({
      opacity: opacities[1].value,
    })),
    useAnimatedProps(() => ({
      opacity: opacities[2].value,
    })),
    useAnimatedProps(() => ({
      opacity: opacities[3].value,
    })),
  ];

  useEffect(() => {
    emotions.forEach((_, i) => {
      setTimeout(() => {
        animatedRadii[i].value = withTiming(emotions[i].percent, { duration: 1000 });
        opacities[i].value = withTiming(0.85, { duration: 700 });
      }, i * 500);
    });
  }, []);

  const { width } = Dimensions.get('window');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>주간 리포트</Text>
      <Text style={styles.subtitle}>애정표현, 배려심, 적극도 시각적 통계</Text>
      <Svg height="260" width={width}>
        {emotions.map((e, i) => (
          // @ts-ignore
          <AnimatedG
            key={e.id}
            animatedProps={animatedGroupProps[i]}
          >
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
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: { fontSize: 14 },
});
