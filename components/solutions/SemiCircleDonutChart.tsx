import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from "react-native-svg";

export type StackedBarItem = {
  label: string;
  value: number;
  color: string;
};

export type StackedBarChartProps = {
  title?: string;
  data: StackedBarItem[];
  width?: number;
  radius?: number;
  thickness?: number;
};

function polarToCartesian(cx, cy, r, angle) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

// 반원(180~0)에서 파이 조각을 부채꼴로!
function describeWedge(cx, cy, r, thickness, startAngle, endAngle) {
  // 바깥 arc 시작, 끝
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);

  // 안쪽 arc 시작, 끝 (r - thickness)
  const innerEnd = polarToCartesian(cx, cy, r - thickness, endAngle);
  const innerStart = polarToCartesian(cx, cy, r - thickness, startAngle);

  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${r - thickness} ${r - thickness} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

export default function SemicircleDonutChart({
  title,
  data,
  width = 200,
  radius = 100,
  thickness = 42,
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const cx = width / 2;
  const cy = radius + 6;

  let angle = Math.PI; // 180도(radian) = Math.PI, 세로 기준 좌측에서 시작
  let currentAngle = 180; // 도 단위로 처리 (왼쪽 끝에서 시작)

  const arcs = data.map((item, i) => {
    const percent = total === 0 ? 0 : item.value / total;
    const sweep = percent * 180; // 반원
    const startAngle = currentAngle;
    const endAngle = currentAngle + sweep;
    currentAngle = endAngle; // 누적

    return {
      key: item.label,
      color: item.color,
      path: describeWedge(cx, cy, radius, thickness, startAngle, endAngle),
    };
  });

  return (
    <View style={semiStyles.container}>
      <Text style={semiStyles.title}>{title}</Text>
      <Svg width={width} height={radius + thickness + 10} style={{ marginBottom: -30,}}>
        {arcs.map((arc) => (
          <Path
            key={arc.key}
            d={arc.path}
            fill={arc.color}
          />
        ))}
      </Svg>
      {/* 범례 */}
      <View style={semiStyles.legendContainer}>
        {data.map((item) => (
          <View key={item.label} style={semiStyles.legendItem}>
            <View style={[semiStyles.colorBox, { backgroundColor: item.color }]} />
            <Text style={semiStyles.legendText}>{item.label}</Text>
            <Text style={semiStyles.legendNum}>{item.value}회</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const semiStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 0,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 12,
    marginTop: 5
  },
  legendContainer: {
    marginTop: 6,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
  },
  legendItem: {
    flexDirection: "column",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 4,
    gap: 10,
  },
  colorBox: {
    width: 16,
    height: 16,
    borderRadius: 20,
  },
  legendText: {
    fontSize: 14,
  },
  legendNum: {
    fontSize: 14,
    color: "#9c9c9c",
    marginTop: -5
  },
});