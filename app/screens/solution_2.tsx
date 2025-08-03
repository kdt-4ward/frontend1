import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
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

export default function SolutionPreviewScreen() {
  const user = useAtomValue(userAtom);
  const [positives, setPositives] = useState<string[]>([]);
  const [negatives, setNegatives] = useState<string[]>([]);
  const [summary, setSummary] = useState<SummaryType>();
  const [loading, setLoading] = useState(true);

  const COLORS = ['#FFF1F9', '#FFF9DF', '#EAF8E9', '#E9F4FF', '#F3EEFF']

  useEffect(() => {
    if (!user?.couple_id) return;
    setLoading(true);
    apiFetch(`/analysis/weekly/couple/analysis/${user.couple_id}`)
      .then(res => res.json())
      .then(data => {
        const result = data.data.result;
        console.log(result);
        setPositives(result?.["positive_points"] || []);
        setNegatives(result?.["negative_points"] || []);
        let sum = result?.["summary"]
        sum = sum.replace(/'/g, '"');
        const sumObj = JSON.parse(sum);
        console.log("서머리", sumObj);
        setSummary(sumObj);
      })
      .catch(e => console.error('주간 리포트 데이터 불러오기 실패(analysis)', e))
      .finally(() => setLoading(false));
  }, [user?.couple_id]);
  
  function shuffle(array) {
    let arr = [...array]; // 원본 보존
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  let colorList = [];
  for (let i = 0; i < Math.ceil(summary?.recommendations.length / 5); i++) {
    colorList = colorList.concat(shuffle(COLORS));
  }
  colorList = colorList.slice(0, summary?.recommendations.length);

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>긍정 포인트 👍</Text>
        <View style={{ gap: 10 }}>
          {positives.length === 0
            ? <Text>데이터가 없습니다.</Text>
            : positives.map((text, i) => <Text key={i} style={styles.cardTextTwo}>• {text}</Text>)
          }
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>부정 포인트 👎</Text>
        <View style={{ gap: 10 }}>
          {negatives.length === 0
            ? <Text>데이터가 없습니다.</Text>
            : negatives.map((text, i) => <Text key={i} style={[styles.cardTextTwo, {borderColor: '#A7BAFF', backgroundColor: '#F5F7FF'}]}>• {text}</Text>)
          }
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>커플 상담 조언</Text>
        <View style={{ gap: 20 }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={[styles.cardTextCoupleBox, {borderColor: '#7493F7'}]}>
              <Text style={[styles.cardText, styles.cardTextCoupleTitle, {backgroundColor: '#d4dcf7'}]}>
                {summary?.personal_traits[0].user_id}
              </Text>
              <Text style={styles.cardText}>{summary?.personal_traits[0].content}</Text>
            </View>
            <View style={styles.cardTextCoupleBox}>
              <Text style={[styles.cardText, styles.cardTextCoupleTitle]}>
                {summary?.personal_traits[1].user_id}
              </Text>
              <Text style={styles.cardText}>{summary?.personal_traits[1].content}</Text>
            </View>
          </View>
          <Text style={styles.cardTextThree}>{summary?.issue_analysis?.content}</Text>
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>관계를 위한 제안</Text>
        <View style={{ gap: 10 }}>
          {summary?.recommendations?.length === 0
            ? <Text>데이터가 없습니다.</Text>
            : summary?.recommendations?.map((obj, i) => (
              <View key={i} style={[styles.cardTextThree, {backgroundColor: colorList[i]}]}>
                <Text style={[styles.cardText, {fontSize: 16, fontWeight: 600}]}>{obj.title}</Text>
                <Text style={styles.cardText}>{obj.content}</Text>
              </View>
            ))
          }
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 10,
    paddingBottom: 100,
    paddingTop: 10,
    backgroundColor: '#F0F4FF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 'auto',
  },
  card: {
    paddingHorizontal: 25,
    paddingVertical: 45,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 24,
  },
  cardTextTwo: {
    fontSize: 14,
    lineHeight: 24,
    borderWidth: 1,
    borderColor: '#FFD904',
    borderRadius: 8,
    backgroundColor: '#FFFDF2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignItems: 'center',
  },
  cardTextThree: {
    fontSize: 14,
    lineHeight: 24,
    backgroundColor: '#F1F3F5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: 'center',
    gap: 5
  },
  cardTextCoupleBox: {
    borderWidth: 1,
    borderColor: '#F978B6',
    borderRadius: 8,
    width: '48%',
    gap: 5,
    padding: 15,
  },
  cardTextCoupleTitle: {
    backgroundColor: '#fcddec',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: 600,
    textAlign: 'center',
    marginHorizontal: 'auto',
  }
});