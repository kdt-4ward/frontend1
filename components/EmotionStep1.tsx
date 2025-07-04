import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { emotionCharacters, EmotionCharacter } from "../constants/emotionCharacters";

export default function EmotionStep1({
  onSelect,
}: {
  onSelect: (character: EmotionCharacter) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>오늘의 감정을 고르세요</Text>
      <FlatList
        data={emotionCharacters}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: item.color,
              margin: 10,
              borderWidth: selectedId === item.id ? 3 : 1,
              borderColor: selectedId === item.id ? "#333" : "#ccc",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              setSelectedId(item.id);
              setTimeout(() => onSelect(item), 150);
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "#fff" }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
