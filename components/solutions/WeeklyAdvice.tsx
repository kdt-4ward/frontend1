
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, } from 'react-native';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { apiFetch } from '@/utils/api';
import { router } from 'expo-router';

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
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.couple_id) return;
    setLoading(true);
    apiFetch(`/analysis/weekly/couple/solution/${user.couple_id}?end_date=2025-08-02`)
      .then(res => res.json())
      .then(data => {
        const advice = data;
        console.log("어드바이스: ",advice.data.advice);
        setSummary(advice.data.advice);
      })
      .catch(e => console.error('주간 리포트 데이터 불러오기 실패(solution)', e))
      .finally(() => setLoading(false));
  }, [user?.couple_id]);


  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>관계 솔루션</Text>
      <Text style={styles.cardText}>{summary}</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/screens/solution_2")}>
        <Text style={styles.buttonText}>자세한 솔루션 보러가기 {'>'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dde4fe',
    borderRadius: 10,
    gap: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    width: '100%',
    backgroundColor: '#F1F3F5',
    padding: 16,
    borderRadius: 10,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 24,
    width: '100%'
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: '#7493F7',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 'auto',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#fff',
  },
});
