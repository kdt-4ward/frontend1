import React, { useState } from 'react';
import {
  View, FlatList, StyleSheet, Text, RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@/context/UserContext';
import { usePosts } from '@/context/PostContext';
import PostThumbnail from '@/components/PostThumbnail';
import { Pressable } from 'react-native-gesture-handler';

const API_BASE_URL = 'http://192.168.0.217:8000';

export default function TabPostScreen() {
  const router = useRouter();
  const { userInfo } = useUser();
  const coupleId = userInfo?.couple_id;
  const [remotePosts, setRemotePosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    if (!coupleId) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/post/couple/${coupleId}`);
      const data = await response.json();
      setRemotePosts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log('📛 게시글 불러오기 실패:', e);
    }
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPosts();
    }, [coupleId])
  );

  const onRefresh = () => {
    fetchPosts();
  };

  const goDetail = (postId: number) => {
    router.push({ pathname: '/post/[id]', params: { id: String(postId) } });
  };

  const renderItem = ({ item }: { item: any }) => (
    <PostThumbnail
      images={item.images}
      postId={item.post_id}
      onPress={() => {
        if (item.post_id) goDetail(item.post_id);
      }}
    />
  );

  const combinedPosts = [
    ...remotePosts.map((p) => ({
      ...p,
      // images: [],
      isLocal: false,
    })),
  ];

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={combinedPosts}
        renderItem={renderItem}
        keyExtractor={(item, index) => `post-${item.post_id ?? 'local'}-${index}`}
        numColumns={3}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={{ marginTop: 50, alignItems: 'center' }}>
            <Text style={{ color: '#aaa' }}>아직 게시글이 없습니다</Text>
          </View>
        }
      />
      <Pressable
        style={styles.fab}
        onPress={() => router.push('/post/edit')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#2196f3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
