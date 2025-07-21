import React from 'react';
import { View } from 'react-native';
import { Badge } from 'react-native-elements';
import { IconSymbol } from '../components/ui/IconSymbol'; // 기존 아이콘
import { useAtomValue } from 'jotai';
import { unreadCoupleChatAtom } from '@/atoms/notificationAtom';

export default function CoupleChatTabIcon({ color }: { color: string }) {
  const unread = useAtomValue(unreadCoupleChatAtom);

  return (
    <View>
      <IconSymbol size={28} name="paperplane.fill" color={color} />
      {unread > 0 && (
        <Badge
          status="error"
          value={unread > 99 ? "99+" : unread}
          containerStyle={{
            position: 'absolute',
            top: -4, right: -10,
          }}
        />
      )}
    </View>
  );
}
