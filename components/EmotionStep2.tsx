
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { emotionTags, EmotionTag } from "@/constants/emotionTag";

const numColumns = 3;
const windowHeight = Dimensions.get("window").height;

interface Props {
  onSubmit: (selected: string[]) => void;
  initialSelected?: string[];
  onCancel?: () => void;
}

export default function EmotionStep2({ onSubmit, initialSelected, onCancel }: Props) {
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
      {/* X(닫기) 버튼 */}

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
                  backgroundColor: selectedLabels.includes(item.label) ? item.color : "#eee",
                  borderWidth: selectedLabels.includes(item.label) ? 2 : 1,
                  borderColor: selectedLabels.includes(item.label) ? "#333" : "#ccc",
                },
              ]}
              onPress={() => toggleSelect(item.label)}
              activeOpacity={0.8}
            >
              <Text style={{
                color: selectedLabels.includes(item.label) ? "#fff" : "#333",
                fontWeight: selectedLabels.includes(item.label) ? "bold" : "normal"
              }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      {/* 하단 "선택 완료" 버튼 */}
      <View style={styles.arrowWrap}>
        <TouchableOpacity
          style={styles.arrowBtn}
          disabled={selectedLabels.length === 0}
          onPress={() => onSubmit(selectedLabels)}
        >
          <Ionicons name="arrow-forward" size={30} color={selectedLabels.length > 0 ? "#222" : "#d0d0d0"} />
        </TouchableOpacity>
      </View>

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
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 80,
    marginBottom: 28,
    color: "#333"
  },
  gridWrap: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 110,
  },
  grid: {
    alignItems: "center",
    justifyContent: "flex-end",
    minHeight: windowHeight * 0.36,
  },
  tagBtn: {
    minWidth: 74,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    margin: 8,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  arrowWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 36,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  arrowBtn: {
    backgroundColor: "#fff",
    borderRadius: 30,
    elevation: 4,
    shadowColor: "#222",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    padding: 8,
  }
});
