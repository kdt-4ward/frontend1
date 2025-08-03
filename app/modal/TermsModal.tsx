import { Modal, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { privacyPolicyText, serviceTermsText } from '../../constants/privacyPolicyText';

export default function TermsModal({ visible, onClose, type }: { visible: boolean; onClose: () => void; type: "privacy" | "terms" }) {

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{
        flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'center', alignItems:'center'
      }}>
        <View style={{
          backgroundColor:'#fff', borderRadius:16, padding:16, width:'90%', maxHeight:'85%'
        }}>
          <ScrollView>
            <Text style={{fontWeight:'bold', fontSize:18, marginBottom: 14, textAlign: 'center'}}>
              {type === "privacy" ? "개인정보 처리방침" : "서비스 이용약관"}
            </Text>
            <Text style={{fontSize:14, color:'#333', lineHeight:21, marginBottom: 14}}>
              {type === "privacy" ? privacyPolicyText : serviceTermsText}
            </Text>
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={{
            marginTop:12, backgroundColor:'#7493F7', borderRadius:8, alignItems:'center', padding:10
          }}>
            <Text style={{color:'#fff', fontWeight:'bold'}}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
