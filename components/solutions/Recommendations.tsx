
import React, { useEffect, useState } from 'react';
import { Linking, Image, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { apiFetch } from '@/utils/api';
import { router } from 'expo-router';

type SongProps = {
  reason: string,
  title: string,
  youtube_info: {
    thumbnail_url: string,
    youtube_url: string,
  }
}

type MovieProps = {
  reason: string,
  title: string,
  tmdb_info: {
    overview: string,
    poster_url: string,
    release_date: string,
    vote_average: Float16Array,
  }
}

export default function Recommendations() {
  const user = useAtomValue(userAtom);
  const [song, setSong] = useState<SongProps>();
  const [movie, setMovie] = useState<MovieProps>();
  const [loading, setLoading] = useState(true);
  const naverUrl = `https://www.google.com/search?q=영화 ${encodeURIComponent(movie?.title)}`;

  useEffect(() => {
    if (!user?.couple_id) return;
    setLoading(true);
    apiFetch(`/recommendations/couple/${user.couple_id}/songs`)
      .then(res => res.json())
      .then(data => {
        const resultSong = data.data.song;
        setSong(resultSong);
        console.log(resultSong)
      })
      .catch(e => console.error('추천 음악 불러오기 실패', e))
      .finally(() => setLoading(false)); 
  }, [user?.couple_id]);

  useEffect(() => {
    if (!user?.couple_id) return;
    setLoading(true);
    apiFetch(`/recommendations/couple/${user.couple_id}/movies`)
      .then(res => res.json())
      .then(data => {
        const resultMovie = data.data.movie;
        setMovie(resultMovie);
        console.log(resultMovie)
      })
      .catch(e => console.error('추천 영화 불러오기 실패', e))
      .finally(() => setLoading(false)); 
  }, [user?.couple_id]);


  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>추천 음악</Text>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: '/webview/youtubeWebView',
            params: { url: encodeURIComponent(song.youtube_info.youtube_url) }
          })
        }
      >
        <View style={styles.card}>
          <Image
            source={{ uri: song?.youtube_info.thumbnail_url }}
            style={{ width: '100%', height: 150, borderRadius: 8, alignSelf: 'center' }}
          />
          <Text style={[styles.cardText, {fontSize: 16, fontWeight: 600}]}>{song?.title}</Text>
          <Text style={styles.cardText}>{song?.reason}</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>추천 영화</Text>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: '/webview/youtubeWebView',
            params: { url: naverUrl }
          })
        }
      >
        <View style={styles.card}>
          <Image
            source={{ uri: movie?.tmdb_info.poster_url }}
            style={{ width: '100%', height: 450, borderRadius: 8, alignSelf: 'center' }}
          />
          <Text style={[styles.cardText, {fontSize: 16, fontWeight: 600}]}>{movie?.title}</Text>
          <Text style={styles.cardText}>{movie?.reason}</Text>
        </View>
      </TouchableOpacity>
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
});
