import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  FlatList,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { usePosts } from '../../context/PostContext';
import { useUser } from '../../context/UserContext';

const API_BASE_URL = 'http://192.168.0.217:8000';

export default function CaptionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEdit = !!params.editId;

  const { userInfo } = useUser();
  const { draftPost, setDraftPost } = usePosts();
  console.log('🔥 userInfo =', userInfo);

  const imageList = draftPost.images;
  const [caption, setCaption] = useState(draftPost.caption || '');
  const alertShown = useRef(false);

  useEffect(() => {
    if ((!imageList || imageList.length === 0) && !alertShown.current) {
      alertShown.current = true;
      Alert.alert('이미지를 먼저 선택해주세요!', '', [
        {
          text: '확인',
          onPress: () => {
            alertShown.current = false;
            router.back();
          },
        },
      ]);
    }
  }, []);

  const handleSubmit = async () => {
    if (!imageList || imageList.length === 0) {
      Alert.alert('이미지를 먼저 선택해주세요!');
      return;
    }

    if (!userInfo?.user_id) {
      Alert.alert('로그인이 필요합니다');
      return;
    }

    const url = isEdit
      ? `${API_BASE_URL}/post/${params.editId}`
      : `${API_BASE_URL}/post/`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userInfo.user_id,
          couple_id: userInfo.couple_id,
          content: caption,
          images: imageList.map((url, index) => ({
            image_url: url,
            image_order: index
          })),
        }),
      });

      if (!response.ok) throw new Error('서버 오류');

      Alert.alert(isEdit ? '수정 완료!' : '업로드 완료!', '', [
        {
          text: '확인',
          onPress: () => {
            router.replace('/tabpost');
            setTimeout(() => {
              setDraftPost({ images: [], caption: '', author: '' });
            }, 300);
          },
        },
      ]);
    } catch (error) {
      Alert.alert('업로드 실패', '다시 시도해주세요');
      console.error('요청 실패:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={imageList}
        horizontal
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
        )}
        contentContainerStyle={styles.imageRow}
        showsHorizontalScrollIndicator={false}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.label}>게시글 내용</Text>
        <TextInput
          multiline
          placeholder="사진과 함께 추억을 남겨보세요!"
          value={caption}
          onChangeText={setCaption}
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.postButton} onPress={handleSubmit}>
        <Text style={styles.postText}>{isEdit ? '수정하기' : '게시하기'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    minHeight: 100,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    fontSize: 15,
    marginBottom: 10,
  },
  imageRow: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  postButton: {
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  postText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
