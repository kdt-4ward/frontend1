import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { apiFetch } from '@/utils/api';
//  해당 형식으로 백엔드에서 넘겨야함
//  "content_title": "라라랜드",
//   "content_type": "영화",
//   "content_reason": "서로의 감정을 섬세하게 표현한 커플에게 추천합니다.",
//   "content_poster_url": "https://image.tmdb.org/t/p/w500/abc123.jpg",
//   "content_description": "꿈을 좇는 두 청춘의 음악과 사랑 이야기..."

// 임시 테스트용 배포 시 삭제 후 사용
import weeklyData from '@/test_data/weekly_solution_test.json';
const positives = weeklyData.result?.positive_points || [];
const negatives = weeklyData.result?.negative_points || [];
//
export default function WeeklySummaryTabs() {
  const user = useAtomValue(userAtom);
  const [summary, setSummary] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<null | {
    content_title: string;
    content_type: string;
    content_reason: string;
    content_poster_url?: string; // 포스터 이미지 추가
    content_description?: string; // 영화 개요 추가
  }>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      if (!user?.couple_id) return;
      try {
        const res = await apiFetch(`/weekly/couple/${user.couple_id}`);
        const rec = await apiFetch(`/weekly/recommendations/${user.couple_id}`);
        if (res.ok) {
          const data = await res.json();
          const latest = data.data?.[0]?.result?.summary_list || [];
          setSummary(latest);
        }
        if (rec.ok) {
          const data = await rec.json();
          const latest = data.data?.[0];
          if (latest) {
            setRecommendation({
              content_title: latest.content_title,
              content_type: latest.content_type,
              content_reason: latest.content_reason,
              content_poster_url: latest.content_poster_url,
              content_description: latest.content_description,
            });
          }
        }
      } catch (err) {
        console.error('주간 요약 또는 추천 불러오기 실패', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeeklyData();
  }, [user?.couple_id]);

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

//   const positives = summary.filter(s => s.includes('애정') || s.includes('배려') || s.includes('좋았다'));
//   const negatives = summary.filter(s => s.includes('서운') || s.includes('갈등') || s.includes('예민'));
    // weeklyData.result?.positive_points와 negative_points를 직접 사용
    const positives = weeklyData.result?.positive_points || [];
    const negatives = weeklyData.result?.negative_points || [];

  return (
    <View style={styles.container}>
        <Text style={styles.sectionTitle}>긍정 포인트</Text>
        <View style={styles.card}>
        {positives.length === 0 ? <Text>데이터가 없습니다.</Text> : positives.map((text, i) => (
            <Text key={i} style={styles.cardText}>{text}</Text>
        ))}
        </View>

        <Text style={styles.sectionTitle}>부정 포인트</Text>
        <View style={styles.card}>
        {negatives.length === 0 ? <Text>데이터가 없습니다.</Text> : negatives.map((text, i) => (
            <Text key={i} style={styles.cardText}>{text}</Text>
        ))}
        </View>

      <Text style={styles.sectionTitle}>추천 콘텐츠</Text>
      <View style={styles.card}>
        {recommendation ? (
          <View>
            <Text style={styles.contentType}>|{recommendation.content_type}| {recommendation.content_title}</Text>
            {recommendation.content_poster_url && (
              <Image source={{ uri: recommendation.content_poster_url }} style={styles.posterImage} />
            )}
            <Text style={styles.cardText}>{recommendation.content_reason}</Text>
            {recommendation.content_description && (
              <Text style={[styles.cardText, { marginTop: 10 }]}>{recommendation.content_description}</Text>
            )}
          </View>
        ) : <Text>추천 정보가 없습니다.</Text>}
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
  contentType: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  posterImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 12,
  },
});