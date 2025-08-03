import React from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from "react-native";
import Modal from "react-native-modal";
import { BlurView } from "expo-blur";

const win = Dimensions.get("window");

interface BottomBlurModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  heightRatio?: number; // 0~1, 기본값 0.6
}

export default function BottomBlurModal({
  visible,
  onClose,
  children,
  heightRatio = 0.6,
}: BottomBlurModalProps) {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      backdropTransitionOutTiming={0}
      style={styles.modal}
      swipeDirection="down"
      onSwipeComplete={onClose}
      backdropOpacity={0.45}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      propagateSwipe={true}
    >
      <View style={[styles.blurWrap, { minHeight: win.height * heightRatio }]}>
        <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.content}>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  blurWrap: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
    backgroundColor: "rgba(80, 80, 80, 0.1)",
    paddingBottom: 26,
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  content: {
    alignItems: "center",
    marginBottom: 50,
  },
  closeBtn: {
    marginTop: 22,
    paddingVertical: 10,
    paddingHorizontal: 32,
    backgroundColor: "#ECECFA",
    borderRadius: 16,
    alignSelf: "center",
  }
});
