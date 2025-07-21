
import { Platform, Alert, ActionSheetIOS } from "react-native";
import * as Clipboard from 'expo-clipboard';

const handleLongPress = (content: string) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['복사하기', '취소'],
          cancelButtonIndex: 1,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            Clipboard.setStringAsync(content);
            Alert.alert('복사 완료', '메시지가 복사되었습니다.');
          }
        }
      );
    } else {
      Alert.alert(
        '복사하기',
        '메시지를 복사할까요?',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '복사하기',
            onPress: () => {
              Clipboard.setStringAsync(content);
              Alert.alert('복사 완료', '메시지가 복사되었습니다.');
            }
          }
        ]
      );
    }
};

export default handleLongPress;