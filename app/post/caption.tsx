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
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useAtom } from 'jotai';
import { draftPostAtom } from '@/atoms/postAtom';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { backendBaseUrl } from '@/constants/app.constants';

export default function CaptionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEdit = !!params.editId;
  const [isSubmitting, setIsSubmitting] = useState(false);  

  const userInfo = useAtomValue(userAtom);
  const [draftPost, setDraftPost] = useAtom(draftPostAtom);
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
    if (isSubmitting) return;

    if (!imageList || imageList.length === 0) {
      Alert.alert('이미지를 먼저 선택해주세요!');
      return;
    }

    if (!userInfo?.user_id) {
      Alert.alert('로그인이 필요합니다');
      return;
    }
    setIsSubmitting(true);

    const url = isEdit
      ? `${backendBaseUrl}/post/${params.editId}`
      : `${backendBaseUrl}/post/`;
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

      const data = await response.json();
      const postId = isEdit
        ? params.editId
        : data.post_id || data.id;  // 서버 응답에 따라 다름

      Alert.alert(isEdit ? '수정 완료!' : '업로드 완료!', '', [
        {
          text: '확인',
          onPress: () => {
            if (isEdit) {
              router.replace({
                pathname: '/post/[id]',
                params: { id: String(postId) }
              });
            } else {
              router.replace('/screens/tabpost');
            }
            setTimeout(() => {
              setDraftPost({ images: [], caption: '', author: '' });
              setIsSubmitting(false);
            }, 300);
          },
        },
      ]);
      
    } catch (error) {
      Alert.alert('업로드 실패', '다시 시도해주세요');
      console.error('요청 실패:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
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

        <TouchableOpacity
          style={[
            styles.postButton,
            isSubmitting && { opacity: 0.6 }, // 등록 중엔 흐리게 표시
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting} // ✅ 등록/수정 중에는 버튼 비활성화
        >
          <Text style={styles.postText}>
            {isEdit
              ? isSubmitting
                ? '수정 중...'
                : '수정하기'
              : isSubmitting
                ? '게시 중...'
                : '게시하기'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
    backgroundColor: '#7493F7',
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
