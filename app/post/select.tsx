import React, { useState, useEffect } from 'react';
import {
  View,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function SelectScreen() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // 권한 요청
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('앨범 접근 권한이 필요합니다.');
      }
    })();
  }, []);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setSelectedImages(uris);
    }
  };

  const goToEdit = () => {
    if (selectedImages.length === 0) {
      Alert.alert('사진을 선택해주세요.');
      return;
    }
    router.push({
      pathname: '/post/edit',
      params: { images: JSON.stringify(selectedImages) },
    });
  };

  return (
    <View style={styles.container}>
      <Button title="앨범에서 사진 선택하기" onPress={pickImages} />

      <ScrollView horizontal style={styles.imageRow}>
        {selectedImages.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.image} />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.nextButton} onPress={goToEdit}>
        <Text style={styles.nextText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  imageRow: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
  nextButton: {
    marginTop: 'auto',
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Image,
//   FlatList,
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import * as MediaLibrary from 'expo-media-library';
// import { useRouter } from 'expo-router';

// export default function SelectScreen() {
//   const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
//   const [selected, setSelected] = useState<string[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     (async () => {
//       const { status } = await MediaLibrary.requestPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('권한이 필요합니다');
//         return;
//       }
//       const album = await MediaLibrary.getAssetsAsync({
//         mediaType: 'photo',
//         sortBy: [['creationTime', false]],
//         first: 50,
//       });
//       setPhotos(album.assets);
//     })();
//   }, []);

//   const toggleSelect = (uri: string) => {
//     if (selected.includes(uri)) {
//       setSelected(selected.filter(item => item !== uri));
//     } else {
//       setSelected([...selected, uri]);
//     }
//   };

//   const goToEdit = () => {
//     if (selected.length === 0) {
//       Alert.alert('사진을 선택해주세요.');
//       return;
//     }
//     router.push({
//       pathname: '/post/edit',
//       params: { images: JSON.stringify(selected) },
//     });
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <FlatList
//         data={photos}
//         numColumns={3}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity onPress={() => toggleSelect(item.uri)}>
//             <Image
//               source={{ uri: item.uri }}
//               style={[
//                 styles.image,
//                 selected.includes(item.uri) && styles.selectedImage,
//               ]}
//             />
//           </TouchableOpacity>
//         )}
//       />
//       <TouchableOpacity style={styles.nextButton} onPress={goToEdit}>
//         <Text style={styles.nextText}>다음 ({selected.length})</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   image: {
//     width: '33%',
//     aspectRatio: 1,
//     opacity: 0.9,
//   },
//   selectedImage: {
//     borderWidth: 3,
//     borderColor: '#2196f3',
//     opacity: 1,
//   },
//   nextButton: {
//     backgroundColor: '#2196f3',
//     padding: 16,
//     alignItems: 'center',
//   },
//   nextText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });
