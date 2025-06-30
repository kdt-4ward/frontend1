import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from 'react-native';
import { parseTextscript } from '../utils/textscriptParser';

interface Message {
  text: string;
  isMine: boolean;
}
interface ChatProps {
  userId: string;
}
export default function Chat({userId}: ChatProps) {
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const connectWebSocket = () => {
    const socket = new WebSocket(`wss://57f3-221-148-97-239.ngrok-free.app/ws/${userId}`);
    // const socket = new WebSocket('wss://ws.ifelse.io');
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('✅ WebSocket 연결됨');
      if (reconnectInterval.current) {
        clearInterval(reconnectInterval.current);
        reconnectInterval.current = null;
      }
    };

    socket.onmessage = (e) => {
      const parsed = parseTextscript(e.data);
      setChatLog((prev) => [...prev, { text: parsed, isMine: false }]);
    };

    socket.onclose = () => {
      console.log('❌ WebSocket 연결 종료됨. 재연결 시도 예정...');
      if (!reconnectInterval.current) {
        reconnectInterval.current = setInterval(() => {
          if (
            !socketRef.current ||
            socketRef.current.readyState === WebSocket.CLOSED
          ) {
            console.log('🔄 WebSocket 재연결 시도 중...');
            connectWebSocket();
          }
        }, 5000); // 5초마다 재연결 시도
      }
    };

    socket.onerror = (err) => {
      console.error('WebSocket 오류 발생:', err);
      socket.close();
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (socketRef.current) socketRef.current.close();
      if (reconnectInterval.current) clearInterval(reconnectInterval.current);
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
      const parsed = parseTextscript(message);
      setChatLog((prev) => [...prev, { text: parsed, isMine: true }]);
      setMessage('');
    } else {
      console.warn('WebSocket이 연결되지 않았습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chatLog}
        renderItem={({ item }) => (
          <Text
            style={{
              alignSelf: item.isMine ? 'flex-end' : 'flex-start',
              marginVertical: 4,
            }}
          >
            {item.text}
          </Text>
        )}
        keyExtractor={(_, idx) => idx.toString()}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { color: '#000', backgroundColor: '#fff' }]} // 이 줄 추가
          value={message}
          onChangeText={setMessage}
          placeholder="메시지를 입력하세요"
          placeholderTextColor="#999" // placeholder도 잘 보이게
        />
        <Button title="보내기" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  inputRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#ccc',
    marginTop: 10,
    paddingTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 6,
  },
});


// components/Chat.tsx

// import React, { useEffect, useRef, useState } from 'react';
// import {
//   View,
//   TextInput,
//   Button,
//   FlatList,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import MessageBubble from '../components/MessageBubble';
// import { parseTextscript } from '../utils/textscriptParser';

// interface Message {
//   text: string;
//   isMine: boolean;
// }

// export default function Chat() {
//   const [chatLog, setChatLog] = useState<Message[]>([]);
//   const [message, setMessage] = useState('');
//   const socketRef = useRef<WebSocket | null>(null);

//   useEffect(() => {
//     const socket = new WebSocket('wss://ws.ifelse.io');
//     socketRef.current = socket;

//     socket.onmessage = (e) => {
//       const parsed = parseTextscript(e.data);
//       setChatLog((prev) => [...prev, { text: parsed, isMine: false }]);
//     };

//     socket.onclose = () => console.log('WebSocket 연결 해제됨.');

//     return () => {
//       socket.close();
//     };
//   }, []);

//   const sendMessage = () => {
//     if (!message.trim()) return;
//     socketRef.current?.send(message);
//     setChatLog((prev) => [...prev, { text: parseTextscript(message), isMine: true }]);
//     setMessage('');
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.wrapper}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       keyboardVerticalOffset={90}
//     >
//       <FlatList
//         data={chatLog}
//         inverted
//         contentContainerStyle={styles.chatContainer}
//         keyExtractor={(_, idx) => idx.toString()}
//         renderItem={({ item }) => (
//           <MessageBubble text={item.text} isMine={item.isMine} />
//         )}
//       />

//       <View style={styles.inputRow}>
//         <TextInput
//           style={styles.input}
//           value={message}
//           onChangeText={setMessage}
//           placeholder="메시지를 입력하세요"
//         />
//         <Button title="전송" onPress={sendMessage} />
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   wrapper: { flex: 1, backgroundColor: '#f9f9f9' },
//   chatContainer: { padding: 12, flexGrow: 1, justifyContent: 'flex-end' },
//   inputRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     borderTopWidth: 0.5,
//     borderColor: '#ccc',
//     backgroundColor: '#fff',
//   },
//   input: {
//     flex: 1,
//     backgroundColor: '#eee',
//     borderRadius: 20,
//     paddingHorizontal: 16,
//     marginRight: 8,
//     fontSize: 16,
//     height: 40,
//   },
// });
