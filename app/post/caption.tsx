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
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function CaptionScreen() {
  const { images } = useLocalSearchParams();
  const router = useRouter();

  const imageList: string[] = JSON.parse(images as string);
  const [caption, setCaption] = useState('');

  const handleSubmit = () => {
    if (!caption.trim()) {
      Alert.alert('내용을 입력해주세요!');
      return;
    }

    console.log('🔥 게시물 업로드!');
    console.log('🖼️ 이미지:', imageList);
    console.log('📝 텍스트:', caption);

    Alert.alert('게시 완료 (임시)');
    router.replace('/(tabs)/tabpost'); // 게시 후 피드로 이동
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <Text style={styles.label}>게시글 내용</Text>
        <TextInput
          multiline
          placeholder="설명을 입력하세요..."
          value={caption}
          onChangeText={setCaption}
          style={styles.input}
        />

        <Text style={styles.label}>선택한 사진</Text>
        <ScrollView horizontal style={styles.imageRow}>
          {imageList.map((uri, idx) => (
            <Image key={idx} source={{ uri }} style={styles.image} />
          ))}
        </ScrollView>
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
