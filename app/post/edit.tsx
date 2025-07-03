
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';

import { usePost } from '../context/PostContext';


export default function EditScreen() {
  const router = useRouter();
  const { setPost } = usePost();
  const [imageList, setImageList] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [rotateDeg, setRotateDeg] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      if (uris.length > 10) {
        Alert.alert('최대 10장까지 선택할 수 있어요.');
        return;
      }
      setImageList(uris);
      setSelectedIndex(0);
      setRotateDeg(0);
      setIsFlipped(false);
      setPost((prev) => ({ ...prev, images: uris }));

    }
  };

  const goToCaption = () => {
    console.log("goToCaption");
    console.log("imageList",imageList);
    if (imageList.length === 0) {
      Alert.alert('사진을 먼저 선택하세요!');
      return;
    }

    // router.push({
    //   pathname: '/post/caption',
    //   params: {
    //     images: JSON.stringify(imageList),
    //   },
    // });
    router.push('/post/caption'); 
  };

  const onDragEnd = ({ data }: { data: string[] }) => {
    const prevUri = imageList[selectedIndex];
    setImageList(data);

    const newIndex = data.indexOf(prevUri);
    setSelectedIndex(newIndex >= 0 ? newIndex : 0);
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<string>) => {
    const index = imageList.indexOf(item);

    return (
      <TouchableOpacity
        onLongPress={drag}
        onPress={() => {
          setSelectedIndex(index);
          setRotateDeg(0);
          setIsFlipped(false);
        }}
        style={[
          styles.thumbContainer,
          selectedIndex === index && styles.thumbSelected,
        ]}
      >
        <Image source={{ uri: item }} style={styles.thumbImage} />
      </TouchableOpacity>
    );
  };

  const currentImage = imageList[selectedIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>사진 편집</Text>

      {currentImage ? (
        <Image
          source={{ uri: currentImage }}
          style={[
            styles.image,
            {
              transform: [
                { rotate: `${rotateDeg}deg` },
                { scaleX: isFlipped ? -1 : 1 },
              ],
            },
          ]}
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={{ color: '#999' }}>사진을 선택해주세요</Text>
        </View>
      )}

      {/* 회전 / 반전 버튼 */}
      <View style={styles.editRow}>
        <Button title="↺ 회전" onPress={() => setRotateDeg((d) => (d + 90) % 360)} />
        <Button title="↔ 반전" onPress={() => setIsFlipped((v) => !v)} />
      </View>

      {/* 드래그 가능한 썸네일 목록 */}
      <DraggableFlatList
        data={imageList}
        keyExtractor={(item) => item}
        horizontal
        onDragEnd={onDragEnd}
        renderItem={renderItem}
        contentContainerStyle={styles.thumbList}
      />

      {/* 다음 버튼 */}
      <TouchableOpacity style={styles.nextButton} onPress={goToCaption}>
        <Text style={styles.nextText}>다음</Text>
      </TouchableOpacity>

      {/* 사진 선택 버튼 */}
      <TouchableOpacity style={styles.pickButton} onPress={pickImages}>
        <Text style={styles.pickText}>사진 선택하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingBottom: 40 },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  image: {
    width: screenWidth - 40,
    height: screenWidth - 40,
    borderRadius: 12,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  placeholder: {
    width: screenWidth - 40,
    height: screenWidth - 40,
    backgroundColor: '#eee',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  editRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  thumbList: {
    paddingVertical: 8,
  },
  thumbContainer: {
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbImage: {
    width: 80,
    height: 80,
  },
  thumbSelected: {
    borderWidth: 2,
    borderColor: '#2196f3',
  },
  nextButton: {
    backgroundColor: '#2196f3',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 12,
  },
  nextText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pickButton: {
    backgroundColor: '#f5f5f5',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  pickText: {
    color: '#333',
    fontWeight: 'bold',
  },
});
