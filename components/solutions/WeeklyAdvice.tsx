
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { apiFetch } from '@/utils/api';

type SummaryType = {
  issue_analysis: {
    content: string
  },
  overview: string,
  personal_traits: PersonalTrait[];
  recommendations: Recommendation[];
}

type PersonalTrait = {
  user_id: string,
  content: string,
}

type Recommendation = {
  title: string;
  content: string;
};

export default function WeeklyAdviceTabs() {
  const user = useAtomValue(userAtom);
  const [positives, setPositives] = useState<string[]>([]);
  const [negatives, setNegatives] = useState<string[]>([]);
  const [summary, setSummary] = useState<SummaryType>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.couple_id) return;
    setLoading(true);
    apiFetch(`/analysis/weekly/couple/solution/${user.couple_id}`)
      .then(res => res.json())
      .then(data => {
        const advice = data;
        console.log("어드바이스: ",advice);
        // setPositives(advice?.["positive_points"] || []);
        // setNegatives(advice?.["negative_points"] || []);
        // let sum = advice?.["summary"]
        // sum = sum.replace(/'/g, '"');
        // const sumObj = JSON.parse(sum);
        // console.log("서머리", sumObj);
        // setSummary(sumObj);
      })
      .catch(e => console.error('주간 리포트 데이터 불러오기 실패(solution)', e))
      .finally(() => setLoading(false));
  }, [user?.couple_id]);


  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>긍정 포인트</Text>
      <View style={styles.card}>
        {positives.length === 0
          ? <Text>데이터가 없습니다.</Text>
          : positives.map((text, i) => <Text key={i} style={styles.cardText}>• {text}</Text>)
        }
      </View>
      <Text style={styles.sectionTitle}>부정 포인트</Text>
      <View style={styles.card}>
        {negatives.length === 0
          ? <Text>데이터가 없습니다.</Text>
          : negatives.map((text, i) => <Text key={i} style={styles.cardText}>• {text}</Text>)
        }
      </View>
      <Text style={styles.sectionTitle}>커플 상담 조언</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>{summary?.overview}</Text>
        {summary?.personal_traits?.length === 0
          ? <Text>데이터가 없습니다.</Text>
          : summary?.personal_traits?.map((obj, i) => (
            <View key={i}>
              <Text style={[styles.cardText, {fontSize: 16, fontWeight: 600}]}>{obj.user_id}</Text>
              <Text style={styles.cardText}>{obj.content}</Text>
            </View>
          ))
        }
        <Text style={styles.cardText}>{summary?.issue_analysis?.content}</Text>
      </View>
      <Text style={styles.sectionTitle}>관계를 위한 제안</Text>
      <View style={styles.card}>
        {summary?.recommendations?.length === 0
          ? <Text>데이터가 없습니다.</Text>
          : summary?.recommendations?.map((obj, i) => (
            <View key={i}>
              <Text style={[styles.cardText, {fontSize: 16, fontWeight: 600}]}>{obj.title}</Text>
              <Text style={styles.cardText}>{obj.content}</Text>
            </View>
          ))
        }
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
    backgroundColor: '#e9e9e9',
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
    width: '100%'
  },
});
