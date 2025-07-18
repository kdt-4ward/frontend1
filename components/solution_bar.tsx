import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
interface CalmBarProps {
  male: number;   // calm 횟수 (남자)
  female: number; // calm 횟수 (여자)
}
const screenWidth = Dimensions.get('window').width;

export default function CalmStackedBar({ male, female }: CalmBarProps) {
  const total = male + female;
  const malePercent = total === 0 ? 0 : Math.round((male / total) * 100);
  const femalePercent = total === 0 ? 0 : 100 - malePercent;

  return (
    <View style={styles.outer}>
      <View style={styles.labelRow}>
        <Text style={styles.genderText}>남자</Text>
        <Text style={styles.calmText}>calm</Text>
        <Text style={styles.genderText}>여자</Text>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.barSegment, { flex: male, backgroundColor: '#FFC978', borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }]}>
          {malePercent > 0 && (
            <Text style={styles.percentTextLeft}>{malePercent}%</Text>
          )}
        </View>
        <View style={[styles.barSegment, { flex: female, backgroundColor: '#FF6868', borderTopRightRadius: 6, borderBottomRightRadius: 6 }]}>
          {femalePercent > 0 && (
            <Text style={styles.percentTextRight}>{femalePercent}%</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    margin: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 2,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  genderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  calmText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#444',
    textAlign: 'center',
  },
  barBackground: {
    flexDirection: 'row',
    height: 30,
    width: screenWidth - 48,
    borderRadius: 6,
    backgroundColor: '#F2F2F2',
    overflow: 'hidden',
    alignItems: 'center',
  },
  barSegment: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentTextLeft: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
  percentTextRight: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 6,
    fontSize: 15,
  },
});
