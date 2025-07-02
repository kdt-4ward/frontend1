
import React from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const dummyPosts = [
  {
    id: '1',
    images: ['https://placekitten.com/400/400'],
  },
  {
    id: '2',
    images: ['https://placekitten.com/401/401'],
  },
  {
    id: '3',
    images: ['https://placekitten.com/402/402'],
  },
  {
    id: '4',
    images: ['https://placekitten.com/403/403'],
  },
  {
    id: '5',
    images: ['https://placekitten.com/404/404'],
  },
];

const numColumns = 3;
const size = Dimensions.get('window').width / numColumns;

export default function TabPostScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof dummyPosts[0] }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/post/[id]',
          params: { id: item.id },
        })
      }
    >
      <Image source={{ uri: item.images[0] }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={dummyPosts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
      />

      {/* ➕ 새 게시물 버튼 */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/post/edit')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: size,
    height: size,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#2196f3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
