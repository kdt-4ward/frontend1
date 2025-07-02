
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const [comments, setComments] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const handleAddComment = () => {
    if (!input.trim()) return;
    setComments([...comments, input.trim()]);
    setInput('');
  };

  const post = {
    id,
    text: '이 날 정말 즐거웠어 ',
    images: [
      'https://placekitten.com/400/400',
      'https://placekitten.com/401/400',
    ],
    date: '2025-07-02',
    author: '소우',
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={Platform.OS === 'android' ? 270 : 40}
    >
      {/* 📸 이미지 */}
      {post.images.map((uri, idx) => (
        <Image key={idx} source={{ uri }} style={styles.image} />
      ))}

      {/* 📝 게시글 텍스트 */}
      <Text style={styles.text}>{post.text}</Text>
      <Text style={styles.meta}>{post.date} · {post.author}</Text>

      {/* 💬 댓글 리스트 */}
      <View style={styles.commentSection}>
        <Text style={styles.commentTitle}>댓글</Text>
        {comments.length === 0 && (
          <Text style={styles.noComment}>아직 댓글이 없어요.</Text>
        )}
        {comments.map((cmt, idx) => (
          <Text key={idx} style={styles.commentItem}>• {cmt}</Text>
        ))}
      </View>

      {/* ✏️ 댓글 입력창 */}
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="댓글을 입력하세요..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity onPress={handleAddComment} style={styles.button}>
          <Text style={styles.buttonText}>등록</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  text: { fontSize: 18, marginBottom: 8 },
  meta: { fontSize: 12, color: '#666', marginBottom: 20 },
  commentSection: { marginTop: 10 },
  commentTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  noComment: { color: '#aaa' },
  commentItem: { fontSize: 14, marginBottom: 4 },
  inputBox: {
    flexDirection: 'row',
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    height: 44,
  },
  button: {
    paddingHorizontal: 12,
    marginLeft: 8,
    backgroundColor: '#2196f3',
    justifyContent: 'center',
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
