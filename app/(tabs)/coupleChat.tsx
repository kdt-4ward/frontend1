import React, { useEffect, useRef, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { coupleAtom } from '@/atoms/coupleAtom';
import { unreadCoupleChatAtom } from '@/atoms/notificationAtom';
import {
  View, Text, TextInput, Button, FlatList, KeyboardAvoidingView,
  Platform, ActivityIndicator, StyleSheet, Alert, Pressable
} from "react-native";
import { backendBaseUrl } from '@/constants/app.constants';
import { apiFetch } from '@/utils/api';
import handleLongPress from '@/hooks/handleLongPress';
import { useIsFocused } from '@react-navigation/native';
import { useSegments } from 'expo-router';
import * as Notifications from 'expo-notifications';

interface Message {
  id: string;
  user_id: string;
  role?: "user" | "partner";
  content: string;
  created_at?: string;
}

export default function CoupleChatScreen() {
  const user = useAtomValue(userAtom);
  const couple = useAtomValue(coupleAtom);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const setCouple = useSetAtom(coupleAtom);
  const socketRef = useRef<WebSocket | null>(null);
  const unreadCount = useAtomValue(unreadCoupleChatAtom);
  const setUnreadCount = useSetAtom(unreadCoupleChatAtom);
  const isFocused = useIsFocused();
  const segments = useSegments();
  
  function isCoupleChatScreenActive() {
    // segments: ['(tabs)', 'coupleChat'] 이런 배열이 됨
    return segments[segments.length - 1] === 'coupleChat';
  }

  useEffect(() => {
    if (isFocused) setUnreadCount(0);
  }, [isFocused]);

 // 1. 채팅 내역 초기 로딩
  useEffect(() => {
    const loadHistory = async () => {
      if (!couple?.couple_id) return;
      setLoading(true);
      try {
        const res = await fetch(`${backendBaseUrl}/history/${encodeURIComponent(couple.couple_id)}`);
        const data = await res.json();
        setMessages(
          data.map((msg: any) => ({
            id: msg.id ? String(msg.id) : `${msg.created_at}-${msg.user_id}`,
            user_id: msg.user_id,
            content: msg.content,
            created_at: msg.created_at,
            role: msg.user_id === user?.user_id ? "user" : "partner",
          }))
        );
      } catch (e) {
        console.error("커플채팅 내역 불러오기 실패", e);
      }
      setLoading(false);
    };
    loadHistory();
  }, [couple?.couple_id]);

  // 2. WebSocket 연결
  useEffect(() => {
    if (!user?.user_id || !couple?.couple_id) return;

    const fetchCoupleInfo = async () => {
      if (user && user.couple_id) {
        const coupleRes = await apiFetch(`/couple/info/${user.couple_id}`);
        if (coupleRes.ok) {
          const coupleInfo = await coupleRes.json();
          setCouple(coupleInfo);
          console.log("커플 연결 성공:", coupleInfo);
        }
      }
    };
    fetchCoupleInfo();

    // 상대방 user_id 가져오기 (couple.user1/2에서 내 user_id와 다른 것)
    const partner_id =
      couple.user1?.user_id === user.user_id ? couple.user2?.user_id : couple.user1?.user_id;

    if (!partner_id) return;

    const wsUrl = backendBaseUrl.replace(/^http/, "ws") + `/ws/${user.user_id}`;
    const socket = new WebSocket(wsUrl);

    // const ws = new WebSocket(`ws://${backendBaseUrl}/ws/${user.user_id}`);

    socket.onopen = () => {
      socket.send(JSON.stringify({
        type: "register_couple",
        partner_id,
        couple_id: couple.couple_id,
      }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("웹소켓 메시지!", event.data);
        if (data.type === "message") {
          // 만약 현재 커플채팅 스크린에 있지 않을 때만 ++
          if (!isCoupleChatScreenActive() || !isFocused) {
            setUnreadCount(count => count + 1);
            Notifications.setBadgeCountAsync(unreadCount + 1);
            Notifications.scheduleNotificationAsync({
              content: { title: "새 커플채팅", body: data.message },
              trigger: null
            });
          }
          setMessages(prev => [
            ...prev,
            {
              id: Date.now() + Math.random() + '', // 간단 고유키
              user_id: data.from,
              content: data.message,
              role: data.from === user.user_id ? "user" : "partner",
              created_at: data.created_at,
            }
          ]);
        } else if (data.type === "system") {
          // 시스템 메시지 (연결됨 등)
        } else if (data.type === "error") {
          Alert.alert('에러', data.message);
        }
      } catch (err) {
        console.log('메시지 파싱 오류:', err);
      }
    };

    socket.onerror = (err) => {
      Alert.alert('WebSocket 에러', JSON.stringify(err));
    };
    socket.onclose = () => {
      // TODO: 연결 종료 UI 처리
    };

    socketRef.current = socket;
    return () => {
      socket.close();
    };
  }, [user?.user_id, couple?.couple_id]);

  // 3. 메시지 전송 함수
  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;
    setLoading(true);
    socketRef.current.send(JSON.stringify({
      type: "message",
      couple_id: couple?.couple_id,
      message: input,
      image_url: null
    }));
    setMessages(prev => [
      ...prev,
      {
        id: Date.now() + Math.random() + '',
        user_id: user!.user_id,
        content: input,
        role: "user",
        created_at: new Date().toISOString(),
      }
    ]);
    setInput('');
    setLoading(false);
  };

  // 스크롤 맨 아래로
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages.length]);

  // 메시지 렌더
  const renderItem = ({ item }: { item: Message }) => (
    <Pressable onLongPress={() => handleLongPress(item.content)}>
      <View style={[styles.message, item.role === "user" ? styles.me : styles.ai]}>
        <Text style={styles.sender}>{item.role === "user" ? "나" : "상대"}</Text>
        <Text style={styles.content}>{item.content}</Text>
      </View>
    </Pressable>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: undefined })}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12 }}
      />
      {loading && <ActivityIndicator size="small" color="#222" style={{ marginBottom: 10 }} />}
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          placeholder="메시지를 입력하세요"
          editable={!loading}
        />
        <Button title="전송" onPress={sendMessage} disabled={!input.trim() || loading} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
