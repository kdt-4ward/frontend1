
import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { emotionCharacters, EmotionCharacter } from "../constants/emotionCharacters";

const numColumns = 4;
// const windowHeight = Dimensions.get("window").height;

export default function EmotionStep1({
  onSelect,
  initialSelected,
}: {
  onSelect: (character: EmotionCharacter) => void;
  initialSelected?: string;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(initialSelected ?? null);

  return (
    <View style={styles.container}>

      {/* 제목 */}
      <Text style={styles.title}>오늘 연인에게 어떤 감정을 느꼈어?</Text>
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
                  shadowOpacity: selectedId === item.id ? 0.7 : 0,
                },
              ]}
              onPress={() => {
                setSelectedId(item.id);
                setTimeout(() => onSelect(item), 120);
              }}
              activeOpacity={0.85}
            >
              <Image source={item.imagePath} style={styles.emoji} resizeMode="contain"/>
            </TouchableOpacity>
          )}
        />
      </View>
      {/* 하단 → 버튼 */}
      {selectedId && (
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
            <Ionicons name="arrow-forward" size={30} color={"#fff"} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
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
  },
  circle: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    margin: 9,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 6,
    elevation: 5,
  },
  emoji: {
    width: 64,
    height: 64,
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
  },
});
