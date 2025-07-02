// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   Button,
//   TouchableOpacity,
//   Dimensions,
// } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';

// export default function EditScreen() {
//   const { images } = useLocalSearchParams();
//   const router = useRouter();

//   const [imageList] = useState<string[]>(JSON.parse(images as string));
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // 회전/반전 상태
//   const [rotateDeg, setRotateDeg] = useState(0);
//   const [isFlipped, setIsFlipped] = useState(false);

//   const currentImage = imageList[currentIndex];

//   const goToNext = () => {
//     router.push({
//       pathname: '/post/caption',
//       params: {
//         images: JSON.stringify(imageList),
//         // 편집 상태는 지금은 전달 X. 실제 저장은 나중에 백엔드에서 처리 가능
//       },
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.stepText}>
//         {currentIndex + 1} / {imageList.length}
//       </Text>

//       <Image
//         source={{ uri: currentImage }}
//         style={[
//           styles.image,
//           {
//             transform: [
//               { rotate: `${rotateDeg}deg` },
//               { scaleX: isFlipped ? -1 : 1 },
//             ],
//           },
//         ]}
//       />

//       <View style={styles.buttonRow}>
//         <Button
//           title="◀ 이전"
//           disabled={currentIndex === 0}
//           onPress={() => {
//             setCurrentIndex(i => i - 1);
//             setRotateDeg(0);
//             setIsFlipped(false);
//           }}
//         />
//         <Button
//           title="다음 ▶"
//           disabled={currentIndex === imageList.length - 1}
//           onPress={() => {
//             setCurrentIndex(i => i + 1);
//             setRotateDeg(0);
//             setIsFlipped(false);
//           }}
//         />
//       </View>

//       <View style={styles.editRow}>
//         <Button title="🔁 회전" onPress={() => setRotateDeg((deg) => (deg + 90) % 360)} />
//         <Button title="↔ 반전" onPress={() => setIsFlipped((flip) => !flip)} />
//       </View>

//       <TouchableOpacity style={styles.nextButton} onPress={goToNext}>
//         <Text style={styles.nextText}>텍스트 작성하러 가기 ➤</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const screenWidth = Dimensions.get('window').width;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, alignItems: 'center' },
//   stepText: { marginBottom: 10, fontSize: 16 },
//   image: {
//     width: screenWidth - 40,
//     height: screenWidth - 40,
//     borderRadius: 12,
//     resizeMode: 'cover',
//     marginBottom: 10,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     marginBottom: 15,
//   },
//   editRow: {
//     flexDirection: 'row',
//     gap: 15,
//     marginBottom: 30,
//   },
//   nextButton: {
//     marginTop: 'auto',
//     backgroundColor: '#2196f3',
//     padding: 15,
//     borderRadius: 8,
//   },
//   nextText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// #######################################################################
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

export default function EditScreen() {
  const router = useRouter();

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
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
      setSelectedImages(uris);
      setRotateDeg(0);
      setIsFlipped(false);
    }
  };

  const goToCaption = () => {
    if (selectedImages.length === 0) {
      Alert.alert('사진을 먼저 선택하세요!');
      return;
    }

    router.push({
      pathname: '/post/caption',
      params: {
        images: JSON.stringify(selectedImages),
      },
    });
  };

  const currentImage = selectedImages[0]; // 첫 번째 사진만 미리보기

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

      {/* 편집 버튼들 */}
      <View style={styles.editRow}>
        <Button title="↺ 회전" onPress={() => setRotateDeg((d) => (d + 90) % 360)} />
        <Button title="↔ 반전" onPress={() => setIsFlipped((v) => !v)} />
      </View>

      {/* 다음 버튼 */}
      <TouchableOpacity style={styles.nextButton} onPress={goToCaption}>
        <Text style={styles.nextText}>다음</Text>
      </TouchableOpacity>

      {/* 📂 사진 선택 버튼 (하단 고정) */}
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
    marginVertical: 20,
  },
  nextButton: {
    backgroundColor: '#2196f3',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  nextText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pickButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 14,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  pickText: {
    color: '#333',
    fontWeight: 'bold',
  },
});

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   Button,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
//   Alert,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { useRouter } from 'expo-router';
// import DraggableFlatList, {
//   RenderItemParams,
// } from 'react-native-draggable-flatlist';

// export default function EditScreen() {
//   const router = useRouter();

//   const [imageList, setImageList] = useState<string[]>([]);
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [rotateDeg, setRotateDeg] = useState(0);
//   const [isFlipped, setIsFlipped] = useState(false);

//   const pickImages = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       allowsMultipleSelection: true,
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       const uris = result.assets.map((a) => a.uri);
//       setImageList(uris);
//       setSelectedIndex(0);
//       setRotateDeg(0);
//       setIsFlipped(false);
//     }
//   };

//   const goToCaption = () => {
//     if (imageList.length === 0) {
//       Alert.alert('사진을 먼저 선택하세요!');
//       return;
//     }

//     router.push({
//       pathname: '/post/caption',
//       params: {
//         images: JSON.stringify(imageList),
//       },
//     });
//   };

//   const onDragEnd = ({ data }: { data: string[] }) => {
//     const prevUri = imageList[selectedIndex];
//     setImageList(data);

//     const newIndex = data.indexOf(prevUri);
//     setSelectedIndex(newIndex >= 0 ? newIndex : 0);
//   };

//   const renderItem = ({ item, drag, isActive }: RenderItemParams<string>) => {
//     const index = imageList.indexOf(item);

//     return (
//       <TouchableOpacity
//         onLongPress={drag}
//         onPress={() => {
//           setSelectedIndex(index);
//           setRotateDeg(0);
//           setIsFlipped(false);
//         }}
//         style={[
//           styles.thumbContainer,
//           selectedIndex === index && styles.thumbSelected,
//         ]}
//       >
//         <Image source={{ uri: item }} style={styles.thumbImage} />
//       </TouchableOpacity>
//     );
//   };

//   const currentImage = imageList[selectedIndex];

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>사진 편집</Text>

//       {currentImage ? (
//         <Image
//           source={{ uri: currentImage }}
//           style={[
//             styles.image,
//             {
//               transform: [
//                 { rotate: `${rotateDeg}deg` },
//                 { scaleX: isFlipped ? -1 : 1 },
//               ],
//             },
//           ]}
//         />
//       ) : (
//         <View style={styles.placeholder}>
//           <Text style={{ color: '#999' }}>사진을 선택해주세요</Text>
//         </View>
//       )}

//       {/* 회전 / 반전 버튼 */}
//       <View style={styles.editRow}>
//         <Button title="↺ 회전" onPress={() => setRotateDeg((d) => (d + 90) % 360)} />
//         <Button title="↔ 반전" onPress={() => setIsFlipped((v) => !v)} />
//       </View>

//       {/* 드래그 가능한 썸네일 목록 */}
//       <DraggableFlatList
//         data={imageList}
//         keyExtractor={(item) => item}
//         horizontal
//         onDragEnd={onDragEnd}
//         renderItem={renderItem}
//         contentContainerStyle={styles.thumbList}
//       />

//       {/* 다음 버튼 */}
//       <TouchableOpacity style={styles.nextButton} onPress={goToCaption}>
//         <Text style={styles.nextText}>다음</Text>
//       </TouchableOpacity>

//       {/* 사진 선택 버튼 */}
//       <TouchableOpacity style={styles.pickButton} onPress={pickImages}>
//         <Text style={styles.pickText}>사진 선택하기</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const screenWidth = Dimensions.get('window').width;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, paddingBottom: 40 },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   image: {
//     width: screenWidth - 40,
//     height: screenWidth - 40,
//     borderRadius: 12,
//     resizeMode: 'cover',
//     alignSelf: 'center',
//   },
//   placeholder: {
//     width: screenWidth - 40,
//     height: screenWidth - 40,
//     backgroundColor: '#eee',
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     alignSelf: 'center',
//   },
//   editRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginVertical: 16,
//   },
//   thumbList: {
//     paddingVertical: 8,
//   },
//   thumbContainer: {
//     marginRight: 10,
//     borderRadius: 8,
//     overflow: 'hidden',
//   },
//   thumbImage: {
//     width: 80,
//     height: 80,
//   },
//   thumbSelected: {
//     borderWidth: 2,
//     borderColor: '#2196f3',
//   },
//   nextButton: {
//     backgroundColor: '#2196f3',
//     padding: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginVertical: 12,
//   },
//   nextText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   pickButton: {
//     backgroundColor: '#f5f5f5',
//     padding: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   pickText: {
//     color: '#333',
//     fontWeight: 'bold',
//   },
// });
