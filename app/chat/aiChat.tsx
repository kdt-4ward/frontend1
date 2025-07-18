import React, { useEffect, useState, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { coupleAtom } from '@/atoms/coupleAtom';
import { View, Text, TextInput, Button, FlatList, KeyboardAvoidingView,
        Platform, ActivityIndicator, StyleSheet } from "react-native";
import { apiFetch } from "@/utils/api";
import { backendBaseUrl } from '@/constants/app.constants';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';


interface Message {
  id: string;
  user_id: string;
  role?: "user" | "assistant"; // 채팅 기록 구분용
  content: string;
  created_at?: string;
}

export default function AiChatScreen() {
  const user = useAtomValue(userAtom);
  const couple = useAtomValue(coupleAtom);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  console.log("home 에서 coupleID:", couple?.couple_id);

  // AI와 채팅 (스트리밍)
  const sendMessageToAI = async () => {
    if (!user?.user_id || !couple?.couple_id || !input.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString() + '-' + uuidv4(),
      user_id: user.user_id,
      content: input,
      role: "user",
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    console.log("보낼 user_id:", user?.user_id, "보낼 couple_id:", couple?.couple_id, "입력값:", input);

    let aiMsgId = "ai-" + Date.now() + '-' + uuidv4();

    // 메시지 보내고, 스트리밍 읽기
    try {
      const res = await fetch(`${backendBaseUrl}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          couple_id: couple.couple_id,
          message: userMsg.content,
        }),
      });

      // 한 번에 전체 AI 답변 받기
      const aiMsg = await res.text();
      console.log("AI 응답:", aiMsg);

      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          user_id: "ai",
          content: aiMsg,
          role: "assistant",
        }
      ]);

    } catch (err) {
      setMessages((prev) => [...prev, {
        id: "ai-error-" + Date.now(),
        user_id: "ai",
        content: "[AI 응답 에러]",
        role: "assistant"
      }]);
      console.error("AI 메시지 스트리밍 에러:", err);
    }
    setLoading(false);
  };

  // 스크롤 자동 내리기
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages.length]);

  // 렌더링
  const renderItem = ({ item }: { item: Message }) => (
    <View style={[styles.message, item.role === "user" ? styles.me : styles.ai]}>
      <Text style={styles.sender}>{item.role === "assistant" ? "AI" : "나"}</Text>
      <Text style={styles.content}>{item.content}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: undefined })}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12 }}
      />
      {loading && <ActivityIndicator size="small" color="#222" style={{ marginBottom: 10 }} />}
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessageToAI}
          placeholder="AI와 대화해보세요!"
          editable={!loading}
        />
        <Button title="전송" onPress={sendMessageToAI} disabled={!input.trim() || loading} />
      </View>
    </KeyboardAvoidingView>
  );
}

export const options = {
  title: '', // 기본 타이틀 제거
  headerTitle: () => <Text style={{fontWeight:'bold', fontSize:18}}>LuvTune AI챗</Text>,
  headerBackTitle: '홈', // iOS에서만
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  message: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 6,
    maxWidth: "85%"
  },
  me: {
    alignSelf: "flex-end",
    backgroundColor: "#f7e5a6"
  },
  ai: {
    alignSelf: "flex-start",
    backgroundColor: "#e6e6f7"
  },
  sender: {
    fontWeight: "bold",
    marginBottom: 2,
    fontSize: 13
  },
  content: {
    fontSize: 16
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingBottom: 40,
    backgroundColor: "#fff"
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 6,
    fontSize: 16
  },
});
