import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity,
  Dimensions, Alert, Button,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { usePosts } from '../../context/PostContext';
import { useUser } from '@/context/UserContext';

const API_BASE_URL = 'http://192.168.0.217:8000';
const MAX_IMAGES = 4;
const screenWidth = Dimensions.get('window').width;

export default function EditScreen() {
  const router = useRouter();
  const { setDraftPost } = usePosts();
  const { userInfo } = useUser();
  const params = useLocalSearchParams();
  const isEdit = !!params.editId;

  const [imageList, setImageList] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [rotateDeg, setRotateDeg] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (isEdit && params.editId) {
        try {
          const res = await fetch(`${API_BASE_URL}/post/${params.editId}`);
          const data = await res.json();
          setImageList(data.images || []);
          setDraftPost({
            images: data.images || [],
            caption: data.content || '',
            author: userInfo?.user_id || '나',
          });
        } catch (err) {
          Alert.alert('게시글 불러오기 실패', '다시 시도해주세요.');
        }
      }
    };
    fetchPost();
  }, [isEdit, params.editId]);

  const uploadImageToServer = async (imageUri: string): Promise<string | null> => {
    console.log("📤 업로드 시도:", imageUri);
    
    if (imageUri.startsWith("http")) {
      // 이미 업로드된 이미지면 그대로 반환
      return imageUri;
    }
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: `upload_${Date.now()}.jpg`,
    } as any);
  
    try {
      const response = await fetch("http://192.168.0.217:8000/upload/image/", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      const data = await response.json();
      return data.image_url;
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      return null;
    }
  };
  
  const pickImages = async () => {
    if (imageList.length >= MAX_IMAGES) {
      Alert.alert(`이미 최대 ${MAX_IMAGES}장까지 추가했어요!`);
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      selectionLimit: MAX_IMAGES - imageList.length,
    });
  
    if (!result.canceled) {
      let uris = result.assets.map((a) => a.uri);
      uris = uris.filter((uri) => !imageList.includes(uri));
  
      const total = imageList.length + uris.length;
      if (total > MAX_IMAGES) {
        Alert.alert(`최대 ${MAX_IMAGES}장까지만 올릴 수 있어요.`);
        uris = uris.slice(0, MAX_IMAGES - imageList.length);
      }
  
      // ✅ S3 대신 FastAPI로 업로드
      const uploadedUrls: string[] = [];
      for (const uri of uris) {
        const url = await uploadImageToServer(uri);
        if (url) uploadedUrls.push(url);
      }
  
      const newList = [...imageList, ...uploadedUrls];
      setImageList(newList);
      setSelectedIndex(newList.length - 1);
      setRotateDeg(0);
      setIsFlipped(false);
    }
  };
  
  const handleDeleteImage = (index: number) => {
    const newList = [...imageList];
    newList.splice(index, 1);
    setImageList(newList);
    if (selectedIndex >= newList.length) {
      setSelectedIndex(newList.length - 1 >= 0 ? newList.length - 1 : 0);
    }
    setRotateDeg(0);
    setIsFlipped(false);
  };

  const handleSelectImage = (index: number) => {
    setSelectedIndex(index);
    setRotateDeg(0);
    setIsFlipped(false);
  };

  const onDragEnd = ({ data }: { data: string[] }) => {
    setImageList(data);
    if (data.length > 0) {
      const prevUri = imageList[selectedIndex];
      const newIndex = data.indexOf(prevUri);
      setSelectedIndex(newIndex >= 0 ? newIndex : 0);
    }
  };

  const goToCaption = () => {
    if (imageList.length === 0) {
      Alert.alert('사진을 먼저 선택하세요!');
      return;
    }
    setDraftPost((prev) => ({
      images: imageList,
      caption: prev.caption, // 이전 내용 유지
      author: userInfo?.user_id || '나',
    }));
    router.push({
      pathname: '/post/caption',
      params: isEdit ? { editId: params.editId } : {},
    });
  };

  const currentImage = imageList[selectedIndex];

  const renderItem = ({ item, drag, isActive, getIndex }: RenderItemParams<string>) => {
    const index = getIndex?.() ?? 0;
    return (
      <View style={styles.thumbWrap}>
        <TouchableOpacity
          onLongPress={drag}
          onPress={() => handleSelectImage(index)}
          style={[styles.thumbContainer, selectedIndex === index && styles.thumbSelected, isActive && { opacity: 0.6, borderColor: '#4fc3f7', borderWidth: 2 }]}
        >
          <Image source={{ uri: item }} style={styles.thumbImage} />
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDeleteImage(index)}
            hitSlop={10}
          >
            <Text style={styles.deleteText}>X</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>사진 편집</Text>
      <Text style={styles.countText}>{imageList.length}/{MAX_IMAGES}</Text>
      <Text style={styles.guideText}>사진을 꾹 누르면 순서를 바꿀 수 있어요</Text>

      {currentImage ? (
        <Image
          source={{ uri: currentImage }}
          style={[styles.image, {
            transform: [
              { rotate: `${rotateDeg}deg` },
              { scaleX: isFlipped ? -1 : 1 },
            ],
          }]}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={{ color: '#999' }}>사진을 선택해주세요</Text>
        </View>
      )}

      <View style={styles.editRow}>
        <Button title="↺ 회전" onPress={() => setRotateDeg((d) => (d + 90) % 360)} />
        <Button title="↔ 반전" onPress={() => setIsFlipped((v) => !v)} />
      </View>

      <DraggableFlatList
        data={imageList}
        keyExtractor={(item) => item}
        horizontal
        onDragEnd={onDragEnd}
        renderItem={renderItem}
        contentContainerStyle={styles.thumbList}
        showsHorizontalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.nextButton} onPress={goToCaption}>
        <Text style={styles.nextText}>다음</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.pickButton} onPress={pickImages}>
        <Text style={styles.pickText}>사진 선택하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingBottom: 40, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  countText: { textAlign: 'center', color: '#888', marginBottom: 4 },
  guideText: { textAlign: 'center', fontSize: 13, color: '#666', marginBottom: 6 },
  image: { width: screenWidth - 40, height: screenWidth - 40, borderRadius: 12, alignSelf: 'center', marginBottom: 4 },
  placeholder: { width: screenWidth - 40, height: screenWidth - 40, backgroundColor: '#eee', borderRadius: 12, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 4 },
  editRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  thumbList: { paddingVertical: 8, minHeight: 92, alignItems: 'center' },
  thumbWrap: { position: 'relative', marginRight: 10 },
  thumbContainer: { borderRadius: 8, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent', backgroundColor: '#fff' },
  thumbImage: { width: 80, height: 80 },
  thumbSelected: { borderColor: '#2196f3', borderWidth: 2 },
  deleteBtn: { position: 'absolute', top: 3, right: 3, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 10, paddingHorizontal: 4, paddingVertical: 1, zIndex: 10 },
  deleteText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  nextButton: { backgroundColor: '#2196f3', padding: 14, borderRadius: 8, alignItems: 'center', marginVertical: 12 },
  nextText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  pickButton: { backgroundColor: '#f5f5f5', padding: 14, borderRadius: 8, alignItems: 'center' },
  pickText: { color: '#333', fontWeight: 'bold' },
});
