
import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { emotionCharacters, EmotionCharacter } from "../constants/emotionCharacters";

const numColumns = 3;
const windowHeight = Dimensions.get("window").height;

export default function EmotionStep1({
  onSelect,
  initialSelected,
  onCancel,
}: {
  onSelect: (character: EmotionCharacter) => void;
  initialSelected?: string;
  onCancel?: () => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(initialSelected ?? null);

  return (
    <View style={styles.container}>

      {/* 제목 */}
      <Text style={styles.title}>오늘의 감정을 골라보세요</Text>
      {/* 캐릭터 그리드(하단에 배치) */}
      <View style={styles.gridWrap}>
        <FlatList
          data={emotionCharacters}
          numColumns={numColumns}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.circle,
                {
                  backgroundColor: item.color,
                  borderWidth: selectedId === item.id ? 3 : 0,
                  borderColor: selectedId === item.id ? "#222" : undefined,
                },
              ]}
              onPress={() => {
                setSelectedId(item.id);
                setTimeout(() => onSelect(item), 120);
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.emoji}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      {/* 하단 → 버튼 */}
      <View style={styles.arrowWrap}>
        <TouchableOpacity
          style={styles.arrowBtn}
          disabled={!selectedId}
          onPress={() => {
            if (selectedId) {
              const char = emotionCharacters.find((c) => c.id === selectedId);
              if (char) onSelect(char);
            }
          }}
        >
          <Ionicons name="arrow-forward" size={30} color={selectedId ? "#222" : "#d0d0d0"} />
        </TouchableOpacity>
      </View>
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
    fontSize: 19,
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
    minHeight: windowHeight * 0.42,
  },
  circle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    margin: 9,
    backgroundColor: "#eee",
  },
  emoji: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold"
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
