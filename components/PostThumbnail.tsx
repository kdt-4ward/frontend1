import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';

const size = Dimensions.get('window').width / 3;

type Props = {
  images?: string[];
  postId?: number | null;
  onPress?: () => void;
};

export default function PostThumbnail({ images, postId, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={{ flex: 1 / 3 }}>
      <Image
        source={{ uri: images?.[0] ?? 'https://via.placeholder.com/150' }}
        style={styles.image}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  image: {
    width: size,
    height: size,
  },
});
