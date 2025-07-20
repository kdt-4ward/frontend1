import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export type StackedBarItem = {
  label: string;
  value: number;
  color: string;
};

export type StackedBarChartProps = {
  title?: string;
  data: StackedBarItem[];
  height?: number;
};

export default function StackedBarChart({ title, data, height = 30 }: StackedBarChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={[styles.barContainer, { height }]}>        
        {data.map((item, index) => {
          return (
            <View
              key={index}
              style={[styles.barSegment, {
                backgroundColor: item.color,
                flex: total === 0 ? 0 : item.value,
              }]}
            />
          );
        })}
      </View>
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label} ({item.value})</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  barContainer: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  barSegment: {
    height: '100%',
  },
  legendContainer: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  colorBox: {
    width: 12,
    height: 12,
    marginRight: 4,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
  },
});
