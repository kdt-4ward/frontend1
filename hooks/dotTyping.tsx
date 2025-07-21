import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

const DotTyping = () => {
  // 3개의 점 각각을 위한 Animated.Value
  const animVals = [useRef(new Animated.Value(0)).current,
                    useRef(new Animated.Value(0)).current,
                    useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const createBounce = (anim, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: -7, duration: 180, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 180, useNativeDriver: true }),
        ])
      ).start();

    createBounce(animVals[0], 0);
    createBounce(animVals[1], 120);
    createBounce(animVals[2], 240);
    // 언마운트시 정리
    return () => animVals.forEach(anim => anim.stopAnimation());
  }, []);

  return (
    <View style={styles.dotsWrap}>
      {animVals.map((anim, i) => (
        <Animated.View key={i}
          style={[
            styles.dot,
            { transform: [{ translateY: anim }] }
          ]}
        />
      ))}
    </View>
  );
};

export default DotTyping;

const styles = StyleSheet.create({
  dotsWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 26,
    paddingHorizontal: 4,
    marginTop: 2
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#8687a2", // 원하는 색으로
    marginHorizontal: 2
  }
});
