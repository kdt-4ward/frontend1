
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { emotionTags, EmotionTag } from "../constants/emotionTag";

const numColumns = 3;
const windowHeight = Dimensions.get("window").height;

interface Props {
  onSubmit: (selected: string[]) => void;
  initialSelected?: string[];
}

export default function EmotionStep2({ onSubmit, initialSelected }: Props) {
  const [selectedLabels, setSelectedLabels] = useState<string[]>(initialSelected ?? []);
  const [warn, setWarn] = useState(false);

  useEffect(() => {
    setSelectedLabels(initialSelected ?? []);
  }, [initialSelected]);

  const toggleSelect = (label: string) => {
    if (selectedLabels.includes(label)) {
      setSelectedLabels(selectedLabels.filter((l) => l !== label));
    } else if (selectedLabels.length < 3) {
      setSelectedLabels([...selectedLabels, label]);
    } else {
      setWarn(true);
      setTimeout(() => setWarn(false), 1500);
    }
  };

  return (
    <View style={styles.container}>
      {/* 뒤로가기(←) 버튼: onBack이 있을 때만 보임 */}

      {/* X(닫기) 버튼: 필요하다면 아래처럼! */}
      {/* {onCancel && (
        <TouchableOpacity onPress={onCancel} style={styles.closeBtn}>
          <Ionicons name="close" size={28} color="#999" />
        </TouchableOpacity>
      )} */}
      {/* 제목 */}
      <Text style={styles.title}>세부 감정을 최대 3개까지 선택하세요</Text>
      {/* 감정 태그 그리드(하단에 배치) */}
      <View style={styles.gridWrap}>
        <FlatList
          data={emotionTags}
          numColumns={numColumns}
          keyExtractor={(item) => item.label}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.tagBtn,
                {
                  backgroundColor: selectedLabels.includes(item.label) ? item.color : "rgba(0, 0, 0, 0.15)",
                  borderColor: selectedLabels.includes(item.label) ? "#333" : "#ccc",
                },
              ]}
              onPress={() => toggleSelect(item.label)}
              activeOpacity={0.8}
            >
              <Text style={{
                fontSize: 15,
                color: "#fff",
                fontWeight: selectedLabels.includes(item.label) ? "bold" : "normal",
              }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      {/* 하단 "선택 완료" 버튼 */}
      {selectedLabels.length > 0 && (
        <View style={styles.arrowWrap}>
          <TouchableOpacity
            style={styles.arrowBtn}
            disabled={selectedLabels.length === 0}
            onPress={() => onSubmit(selectedLabels)}
          >
            <Ionicons name="arrow-forward" size={30} color={"#fff"} />
          </TouchableOpacity>
        </View>
      )}

      {/* 경고 메시지 */}
      {warn && (
        <View style={{
          position: "absolute",
          bottom: 90,
          left: 0,
          right: 0,
          alignItems: "center"
        }}>
          <View style={{
            backgroundColor: "#222",
            paddingVertical: 8,
            paddingHorizontal: 20,
            borderRadius: 18,
            opacity: 0.9
          }}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              최대 3개까지 선택할 수 있어요
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  backBnt: {
    position: "absolute", left: 16, top: 36, padding: 8, zIndex: 10,
  },
  container: {
    flex: 1,
  },
  closeBtn: {
    position: "absolute",
    left: 20,
    top: 44,
    zIndex: 10,
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    textAlign: "center",
    marginBottom: 30,
    color: "#fff",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gridWrap: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  grid: {
    alignItems: "center",
    justifyContent: "flex-end",
    minHeight: windowHeight * 0.36,
    paddingBottom: 100,
  },
  tagBtn: {
    minWidth: 74,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 17,
    margin: 4,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  arrowWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  arrowBtn: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 30,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 8,
  }
});
