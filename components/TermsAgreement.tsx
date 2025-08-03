import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function TermsAgreement({ onShowTerms, onShowPrivacy }: {
  onShowTerms: () => void;
  onShowPrivacy: () => void;
}) {
  return (
    <View style={agreeStyles.row}>
      <Text style={agreeStyles.text}>
        <Text style={agreeStyles.text}>가입 시 </Text>
        <Text style={agreeStyles.link} onPress={onShowTerms}>이용약관</Text>
        <Text style={agreeStyles.text}> 및 </Text>
        <Text style={agreeStyles.link} onPress={onShowPrivacy}>개인정보 취급방침</Text>
        <Text style={agreeStyles.text}>에 동의하게 됩니다.</Text>
      </Text>
    </View>
  );
}

const agreeStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 18, marginBottom: 8, width:'100%', justifyContent:'center' },
  text: { fontSize: 12, color: '#333' },
  link: { color: '#333', textDecorationLine: 'underline' },
});
