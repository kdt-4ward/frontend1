import React, { useState } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export default function FlipCard({
  front,
  back,
  duration = 550,
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const rotate = useSharedValue(0);

  // 클릭 핸들러
  const onPress = () => {
    setIsFlipped((prev) => !prev);
    rotate.value = withTiming(isFlipped ? 0 : 180, { duration });
  };

  // 카드 앞/뒤 스타일
  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${rotate.value}deg` }
    ],
    backfaceVisibility: "hidden",
    width: "100%",
  }));
  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${rotate.value + 180}deg` }
    ],
    backfaceVisibility: "hidden",
    position: "absolute",
    width: "100%",
  }));

  return (
    <Pressable onPress={onPress}>
      <View style={{ width: '100%' }}>
        <Animated.View style={[frontStyle]}>
          {front}
        </Animated.View>
        <Animated.View style={[backStyle]}>
          {back}
        </Animated.View>
      </View>
    </Pressable>
  );
}
