import React, { useEffect, useState, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { View, Text, TextInput, Button, FlatList, KeyboardAvoidingView,
        Platform, ActivityIndicator, StyleSheet, 
        Pressable,
        TouchableOpacity,
        Image } from "react-native";
// import { apiFetch } from "@/utils/api";
import { backendBaseUrl } from '@/constants/app.constants';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import handleLongPress from '@/hooks/handleLongPress';
import DotTyping from '@/hooks/dotTyping';
import { BlurView } from 'expo-blur';


interface Message {
  id: string;
  user_id: string;
  role?: "user" | "assistant"; // 채팅 기록 구분용
  content: string;
  created_at?: string;
}

export default function AiChatScreen() {
  const user = useAtomValue(userAtom);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const [inputHeight, setInputHeight] = useState(44); // 기본 높이

  console.log("home 에서 coupleID:", user?.couple_id);

  useEffect(() => {
    // 초기 메시지 로드
    const loadInitialMessages = async () => {
      if (!user?.user_id || !user?.couple_id) return;
      try {
        const res = await fetch(`${backendBaseUrl}/chat/history/recent?user_id=${encodeURIComponent(user.user_id)}&couple_id=${encodeURIComponent(user.couple_id)}`);
        if (res.ok) {
          const text = await res.json()
          const messages = (text?.data?.messages || []).map(msg => ({
            id: msg.id,
            user_id: user.user_id,
            role: msg.role,
            content: msg.content,
            created_at: msg.created_at,
          }));
          setMessages(messages);
          console.log("메시지:", messages);
        }
      } catch (error) {
        console.error("초기 메시지 로드 에러:", error);
      }
    };
    loadInitialMessages();
  }, []);

  // AI와 채팅 (스트리밍)
  const sendMessageToAI = async () => {
    if (!user?.user_id || !user?.couple_id || !input.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString() + '-' + uuidv4(),
      user_id: user.user_id,
      content: input,
      role: "user",
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    inputRef.current?.focus();
    setLoading(true);
    console.log("보낼 user_id:", user?.user_id, "보낼 couple_id:", user?.couple_id, "입력값:", input);

    let aiMsgId = "ai-" + Date.now() + '-' + uuidv4();

    // 메시지 보내고, 스트리밍 읽기
    try {
      const res = await fetch(`${backendBaseUrl}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          couple_id: user.couple_id,
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
  const renderItem = ({ item }: { item: Message & { isLoading?: boolean } }) => (
    <Pressable disabled={item.isLoading} onLongPress={() => handleLongPress(item.content)}>
      <View style={[
        styles.message,
        item.role === "user" ? styles.me : styles.ai,
        item.isLoading && { opacity: 0.7 }
      ]}>
        <Text style={styles.sender}>
          {item.role === "assistant"
            ? (item.isLoading ? "AI" : "AI")
            : "나"}
        </Text>
        {item.isLoading
          ? <DotTyping />
          : <Text style={styles.content}>{item.content}</Text>
        }
      </View>
    </Pressable>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.select({ ios: "padding", android: undefined })}>
      <BlurView intensity={45} tint="light" style={StyleSheet.absoluteFill} />
      <FlatList
        ref={flatListRef}
        data={
          loading
            ? [
                ...messages,
                {
                  id: "ai-loading",
                  user_id: "ai",
                  role: "assistant",
                  content: "",
                  created_at: "",
                  isLoading: true,
                },
              ]
            : messages
        }
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12 }}
        onContentSizeChange={() => flatListRef.current?.scrollToOffset({ offset: 999999, animated: true })}
        scrollEnabled={true}
      />
      {/* {loading && <ActivityIndicator size="small" color="#222" style={{ marginBottom: 10 }} />} */}
      <View style={styles.inputBox}>
        <TextInput
          ref={inputRef}
          style={[styles.input, { height: inputHeight }, loading && {backgroundColor: '#e4ebff9a'}]}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessageToAI}
          placeholder="AI와 대화해보세요!"
          multiline={true}
          maxLength={500}
          editable={!loading}
          onContentSizeChange={e =>
            setInputHeight(Math.max(44, e.nativeEvent.contentSize.height))
          }
          textAlignVertical="top"
          autoFocus={true}
          blurOnSubmit={false}  // 엔터 쳐도 포커스 유지 (iOS)
        />
        <TouchableOpacity onPress={sendMessageToAI} disabled={!input.trim() || loading}>
          <Image
            style={{ width: 36, height: 36, tintColor: loading ? '#e4ebff9a' : '#E4EBFF' }}
            source={require('@/assets/images/icon-send.png')}
            resizeMode="contain"
          />
        </TouchableOpacity>
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingBottom: 100,
  },
  message: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 6,
    maxWidth: "85%"
  },
  me: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(116,147,247,0.6)"
  },
  ai: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(230,230,247,0.6)"
  },
  sender: {
    fontWeight: "bold",
    marginBottom: 2,
    fontSize: 13,
  },
  content: {
    fontSize: 16
  },
  inputBox: Platform.select({
    ios: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 20,
      paddingVertical: 12,
      paddingHorizontal: 19,
      marginBottom: 40,
      borderWidth: 0,
    },
    android: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 20,
      paddingVertical: 12,
      paddingHorizontal: 19,
      paddingBottom: 0,
      borderWidth: 0,
    },
  }),
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 19,
    marginRight: 6,
    fontSize: 16,
    backgroundColor: '#E4EBFF'
  },
});
