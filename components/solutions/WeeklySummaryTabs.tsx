
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { apiFetch } from '@/utils/api';

type WeeklySummaryTabsProps = {
  weeklyData: any;
};
export default function WeeklySummaryTabs({}: WeeklySummaryTabsProps) {
  const user = useAtomValue(userAtom);
  const [positives, setPositives] = useState<string[]>([]);
  const [negatives, setNegatives] = useState<string[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.couple_id) return;
    setLoading(true);
    apiFetch(`/analysis/weekly/couple/${user.couple_id}`)
      .then(res => res.json())
      .then(data => {
        const result = data.data?.[0]?.result;
        setPositives(result?.["긍정포인트"] || []);
        setNegatives(result?.["부정포인트"] || []);
        setSummary(result?.["요약"] || '');
      })
      .catch(e => console.error('주간 리포트 데이터 불러오기 실패', e))
      .finally(() => setLoading(false));
  }, [user?.couple_id]);

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>긍정 포인트</Text>
      <View style={styles.card}>
        {positives.length === 0
          ? <Text>데이터가 없습니다.</Text>
          : positives.map((text, i) => <Text key={i} style={styles.cardText}>{text}</Text>)
        }
      </View>
      <Text style={styles.sectionTitle}>부정 포인트</Text>
      <View style={styles.card}>
        {negatives.length === 0
          ? <Text>데이터가 없습니다.</Text>
          : negatives.map((text, i) => <Text key={i} style={styles.cardText}>{text}</Text>)
        }
      </View>
      <Text style={styles.sectionTitle}>요약</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>{summary || "요약 정보가 없습니다."}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
});
