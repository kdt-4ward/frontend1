
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { usePost } from '../../context/PostContext'; // ⬅️ PostContext 불러오기

export default function CaptionScreen() {
  const router = useRouter();
  const { post, setPost } = usePost(); // ⬅️ 이미지 + 텍스트 상태 접근
  console.log("CaptionScreen")
  const imageList = post.images;
  const [caption, setCaption] = useState(post.caption || '');

  if (!imageList || imageList.length === 0) {
    Alert.alert('이미지를 먼저 선택해주세요!');
    return (
      <View style={styles.container}>
        <Text>이미지를 먼저 선택해주세요!</Text>
      </View>
    );
  }

  const handleSubmit = () => {
    console.log('🟢 handleSubmit 실행됨');

    if (imageList.length === 0) {
      console.log('🔴 imageList 비어있음');
      Alert.alert('이미지를 먼저 선택해주세요!');
      return;
    }

    console.log('🔥 게시물 업로드!');
    console.log('🖼️ 이미지:', imageList);
    console.log('📝 텍스트:', caption);

    // 상태 초기화 (옵션)
    setPost({ images: [], caption: '' });

    router.replace('/tabpost');
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.imageRow}>
        {imageList.map((uri, idx) => (
          <Image key={idx} source={{ uri }} style={styles.image} />
        ))}
      </ScrollView>

      <ScrollView style={{ flex: 1 }}>
        <Text style={styles.label}>게시글 내용</Text>
        <TextInput
          multiline
          placeholder="설명을 입력하세요..."
          value={caption}
          onChangeText={(text) => {
            setCaption(text);
            setPost((prev) => ({ ...prev, caption: text })); // ⬅️ 실시간으로 context에 저장
          }}
          style={styles.input}
        />
      </ScrollView>

      <TouchableOpacity style={styles.postButton} onPress={handleSubmit}>
        <Text style={styles.postText}>게시하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    minHeight: 100,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
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
