// import React, { useEffect, useState, useRef } from 'react';
// import {
//   View, Text, Image, TextInput, TouchableOpacity,
//   StyleSheet, ScrollView, Alert, Dimensions,KeyboardAvoidingView,
//   Platform,TouchableWithoutFeedback,Keyboard
// } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { useUser } from '../../context/UserContext';

// const API_BASE_URL = 'http://192.168.0.217:8000';
// const SCREEN_WIDTH = Dimensions.get('window').width;
// type Comment = {
//   comment_id: number;
//   post_id: number;
//   user_id: string;
//   comment: string;
//   created_at: string;
// };

// type Post = {
//   post_id: number;
//   user_id: string;
//   couple_id: string;
//   content: string;
//   created_at: string;
//   images: string[];
// };
// export default function PostDetailScreen() {
//   const { userInfo } = useUser();
//   const userId = userInfo?.user_id;
//   const router = useRouter();
//   const { id } = useLocalSearchParams();

//   const [post, setPost] = useState<Post | null>(null);
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [imageSizes, setImageSizes] = useState<{ width: number; height: number }[]>([]);
//   const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const fetchPostAndComments = async () => {
//     if (loading) return;
//     setLoading(true);
//     try {
//       const postRes = await fetch(`${API_BASE_URL}/post/${id}`);
//       const postData = await postRes.json();
//       setPost(postData);

//       const commentRes = await fetch(`${API_BASE_URL}/comment/${id}`);
//       const commentData = await commentRes.json();
//       setComments(Array.isArray(commentData) ? commentData : []);
//     } catch (e) {
//       console.log('게시글/댓글 불러오기 실패', e);
//     }
//     setLoading(false);
//   };

//   const debounceFetch = () => {
//     if (debounceRef.current) clearTimeout(debounceRef.current);
//     debounceRef.current = setTimeout(fetchPostAndComments, 200);
//   };

//   useEffect(() => {
//     debounceFetch();
//   }, [id]);

//   useEffect(() => {
//     if (post?.images?.length) {
//       const fetchSizes = async () => {
//         const promises = post.images.map((uri) =>
//           new Promise<{ width: number; height: number }>((resolve) => {
//             Image.getSize(uri, (width, height) => {
//               resolve({ width, height });
//             }, () => resolve({ width: 1, height: 1 }));
//           })
//         );
//         const sizes = await Promise.all(promises);
//         setImageSizes(sizes);
//       };
//       fetchSizes();
//     }
//   }, [post?.images]);

//   const handleAddComment = async () => {
//     if (!input.trim() || !userId) return;
//     try {
//       await fetch(`${API_BASE_URL}/comment`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           user_id: userId,
//           post_id: Number(id),
//           comment: input.trim() 
//         }),
//       });
//       setInput('');
//       debounceFetch();
//     } catch (e) {
//       Alert.alert('댓글 등록 실패', '다시 시도해주세요');
//     }
//   };

//   const handleDeleteComment = async (commentId: number, commentUserId: string) => {
//     if (commentUserId !== userId) return;
//     try {
//       await fetch(`${API_BASE_URL}/comment/${commentId}?user_id=${userId}`, {
//         method: 'DELETE',
//       });
//       debounceFetch();
//     } catch (e) {
//       Alert.alert('댓글 삭제 실패', '다시 시도해주세요');
//     }
//   };

//   const handleEditPost = () => {
//     if (!post?.post_id) return;
//     router.push({ pathname: '/post/edit', params: { editId: post.post_id } });
//   };

//   const handleDeletePost = () => {
//     if (!post?.post_id) return;
//     Alert.alert('정말 삭제할까요?', '', [
//       { text: '취소', style: 'cancel' },
//       {
//         text: '삭제', style: 'destructive', onPress: async () => {
//           try {
//             const res = await fetch(`${API_BASE_URL}/post/${post.post_id}`, { method: 'DELETE' });
//             if (res.ok) {
//               Alert.alert('삭제 완료', '', [{ text: '확인', onPress: () => router.replace('/tabpost') }]);
//             } else {
//               Alert.alert('삭제 실패', '잠시 후 다시 시도해보세요');
//             }
//           } catch (e) {
//             Alert.alert('삭제 오류', '네트워크 오류');
//           }
//         }
//       }
//     ]);
//   };

//   if (!post) {
//     return <View style={styles.centered}><Text>게시글을 불러오는 중...</Text></View>;
//   }

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       keyboardVerticalOffset={80}
//     >
//       <View style={{ flex: 1 }}>
//         <ScrollView
//           contentContainerStyle={{ flexGrow: 1, padding: 20 }}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={true}
//         >
//           {/* 게시글 이미지 */}
//           {post.images && post.images.length > 0 && (
//             <View style={styles.imageList}>
//               {post.images.map((img, index) => {
//                 const { width, height } = imageSizes[index] || { width: 1, height: 1 };
//                 const ratio = height / width;
//                 const displayHeight = SCREEN_WIDTH * ratio;

//                 return (
//                   <View
//                   key={`${img}-${index}`}
//                   style={{
//                     width: '100%',
//                     marginBottom: 12,
//                     borderRadius: 10,
//                     overflow: 'hidden', // 꼭 필요!
//                     position: 'relative',
//                   }}
//                 >
//                   <Image
//                     source={{ uri: img }}
//                     style={{
//                       width: '100%',
//                       height: displayHeight,
//                       borderRadius: 10,
//                     }}
//                     resizeMode="cover"
//                   />
//                   {/* 👇 이게 핵심: 터치 패스스루 transparent View */}
//                   <View
//                     style={{
//                       position: 'absolute',
//                       left: 0,
//                       right: 0,
//                       top: 0,
//                       height: displayHeight,
//                       borderRadius: 10,
//                       backgroundColor: 'transparent',
//                     }}
//                     pointerEvents="box-none"
//                   />
//                 </View>
//               );
//             })}
//           </View>
//         )}

//           {/* 게시글 본문 */}
//           <Text style={styles.content}>{post.content}</Text>
//           <Text style={styles.meta}>{post.created_at}</Text>

//           {/* 수정/삭제 */}
//           {post.user_id === userId && (
//             <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
//               <TouchableOpacity onPress={handleEditPost}>
//                 <Text style={{ color: 'blue', fontWeight: 'bold', marginRight: 10 }}>수정</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={handleDeletePost}>
//                 <Text style={{ color: 'red', fontWeight: 'bold' }}>삭제</Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           {/* 댓글 리스트 */}
//           <View style={styles.commentSection}>
//             <Text style={styles.commentTitle}>댓글</Text>
//             {comments.length === 0 ? (
//               <Text style={styles.noComment}>아직 댓글이 없어요.</Text>
//             ) : (
//               comments.map((cmt) => (
//                 <View key={cmt.comment_id} style={styles.commentRow}>
//                   <Text style={styles.commentItem}>{cmt.comment}</Text>
//                   {cmt.user_id === userId && (
//                     <TouchableOpacity onPress={() => handleDeleteComment(cmt.comment_id, cmt.user_id)}>
//                       <Text style={{ color: 'red', marginLeft: 8, fontWeight: 'bold' }}>X</Text>
//                     </TouchableOpacity>
//                   )}
//                 </View>
//               ))
//             )}
//           </View>

//           {/* 하단 여유 공간 확보 */}
//           <View style={{ height: 100 }} />
//         </ScrollView>

//         {/* 댓글 입력창 - 하단 고정 */}
//         <View style={styles.inputBox}>
//           <TextInput
//             style={styles.input}
//             placeholder="댓글을 입력하세요..."
//             value={input}
//             onChangeText={setInput}
//           />
//           <TouchableOpacity onPress={handleAddComment} style={styles.button}>
//             <Text style={styles.buttonText}>등록</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </KeyboardAvoidingView>
//   </TouchableWithoutFeedback>
// );
// }

// const styles = StyleSheet.create({
//   container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
//   centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
//   imageList: { marginBottom: 10 },
//   content: { fontSize: 16, marginBottom: 10 },
//   meta: { fontSize: 12, color: '#666', marginBottom: 20 },
//   commentSection: { marginTop: 18, marginBottom: 8 },
//   commentTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
//   noComment: { color: '#aaa' },
//   commentRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
//   commentItem: { fontSize: 14 },
//   inputBox: {
//     flexDirection: 'row',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderTopWidth: 1,
//     borderColor: '#eee',
//     backgroundColor: '#fff',
//     alignItems: 'center',
//   },
//   input: {
//     flex: 1,
//     paddingHorizontal: 10,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 6,
//     height: 44,
//   },
//   button: {
//     paddingHorizontal: 12,
//     marginLeft: 8,
//     backgroundColor: '#2196f3',
//     justifyContent: 'center',
//     borderRadius: 6,
//     height: 44,
//   },
//   buttonText: { color: '#fff', fontWeight: 'bold' },
// });




import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, Dimensions
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from '@/context/UserContext';

const API_BASE_URL = 'http://192.168.0.217:8000';
const SCREEN_WIDTH = Dimensions.get('window').width;
type Comment = {
  comment_id: number;
  post_id: number;
  user_id: string;
  comment: string;
  created_at: string;
};

type Post = {
  post_id: number;
  user_id: string;
  couple_id: string;
  content: string;
  created_at: string;
  images: string[];
};
export default function PostDetailScreen() {
  const { userInfo } = useUser();
  const userId = userInfo?.user_id;
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageSizes, setImageSizes] = useState<{ width: number; height: number }[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPostAndComments = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const postRes = await fetch(`${API_BASE_URL}/post/${id}`);
      const postData = await postRes.json();
      setPost(postData);

      const commentRes = await fetch(`${API_BASE_URL}/comment/${id}`);
      const commentData = await commentRes.json();
      setComments(Array.isArray(commentData) ? commentData : []);
    } catch (e) {
      console.log('게시글/댓글 불러오기 실패', e);
    }
    setLoading(false);
  };

  const debounceFetch = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchPostAndComments, 200);
  };

  useEffect(() => {
    debounceFetch();
  }, [id]);

  useEffect(() => {
    if (post?.images?.length) {
      const fetchSizes = async () => {
        const promises = post.images.map((uri) =>
          new Promise<{ width: number; height: number }>((resolve) => {
            Image.getSize(uri, (width, height) => {
              resolve({ width, height });
            }, () => resolve({ width: 1, height: 1 }));
          })
        );
        const sizes = await Promise.all(promises);
        setImageSizes(sizes);
      };
      fetchSizes();
    }
  }, [post?.images]);

  const handleAddComment = async () => {
    if (!input.trim() || !userId) return;
    try {
      await fetch(`${API_BASE_URL}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: userId,
          post_id: Number(id),
          comment: input.trim() 
        }),
      });
      setInput('');
      debounceFetch();
    } catch (e) {
      Alert.alert('댓글 등록 실패', '다시 시도해주세요');
    }
  };

  const handleDeleteComment = async (commentId: number, commentUserId: string) => {
    if (commentUserId !== userId) return;
    try {
      await fetch(`${API_BASE_URL}/comment/${commentId}?user_id=${userId}`, {
        method: 'DELETE',
      });
      debounceFetch();
    } catch (e) {
      Alert.alert('댓글 삭제 실패', '다시 시도해주세요');
    }
  };

  const handleEditPost = () => {
    if (!post?.post_id) return;
    router.push({ pathname: '/post/edit', params: { editId: post.post_id } });
  };

  const handleDeletePost = () => {
    if (!post?.post_id) return;
    Alert.alert('정말 삭제할까요?', '', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제', style: 'destructive', onPress: async () => {
          try {
            const res = await fetch(`${API_BASE_URL}/post/${post.post_id}`, { method: 'DELETE' });
            if (res.ok) {
              Alert.alert('삭제 완료', '', [{ text: '확인', onPress: () => router.replace('/tabpost') }]);
            } else {
              Alert.alert('삭제 실패', '잠시 후 다시 시도해보세요');
            }
          } catch (e) {
            Alert.alert('삭제 오류', '네트워크 오류');
          }
        }
      }
    ]);
  };

  if (!post) {
    return <View style={styles.centered}><Text>게시글을 불러오는 중...</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {post.images && post.images.length > 0 && (
        <View style={styles.imageList}>
          {post.images.map((img, index) => {
            const { width, height } = imageSizes[index] || { width: 1, height: 1 };
            const ratio = height / width;
            const displayHeight = SCREEN_WIDTH * ratio;

            return (
              <Image
                key={`${img}-${index}`}
                source={{ uri: img }}
                style={{ width: '100%', height: displayHeight, marginBottom: 12, borderRadius: 10 }}
                resizeMode="cover"
              />
            );
          })}
        </View>
      )}

      <Text style={styles.content}>{post.content}</Text>
      <Text style={styles.meta}>{post.created_at}</Text>

      {post.user_id === userId && (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
          <TouchableOpacity onPress={handleEditPost}><Text style={{ color: 'blue', fontWeight: 'bold', marginRight: 10 }}>수정</Text></TouchableOpacity>
          <TouchableOpacity onPress={handleDeletePost}><Text style={{ color: 'red', fontWeight: 'bold' }}>삭제</Text></TouchableOpacity>
        </View>
      )}

      <View style={styles.commentSection}>
        <Text style={styles.commentTitle}>댓글</Text>
        {comments.length === 0 ? (
          <Text style={styles.noComment}>아직 댓글이 없어요.</Text>
        ) : (
          comments.map((cmt) => (
            <View key={cmt.comment_id} style={styles.commentRow}>
              <Text style={styles.commentItem}>{cmt.comment}</Text>
              {cmt.user_id === userId && (
                <TouchableOpacity onPress={() => handleDeleteComment(cmt.comment_id, cmt.user_id)}>
                  <Text style={{ color: 'red', marginLeft: 8, fontWeight: 'bold' }}>X</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </View>

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
      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  imageList: { marginBottom: 10 },
  content: { fontSize: 16, marginBottom: 10 },
  meta: { fontSize: 12, color: '#666', marginBottom: 20 },
  commentSection: { marginTop: 18, marginBottom: 8 },
  commentTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  noComment: { color: '#aaa' },
  commentRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  commentItem: { fontSize: 14 },
  inputBox: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 10,
    alignItems: 'center',
    marginTop: 10,
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
    height: 44,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});