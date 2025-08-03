import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { apiFetch } from "@/utils/api";

export default function KakaoChatUploadModal({ visible, onClose }) {
  const user = useAtomValue(userAtom);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // 파일 선택
  const pickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'text/plain', // .txt만 허용
        multiple: false,
        copyToCacheDirectory: true,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        setFile(res.assets[0]);
      }
    } catch (err) {
      alert("파일 선택 실패");
    }
  };


  // 업로드
  const uploadFile = async () => {
    if (!file || !user?.user_id) {
      alert("파일과 유저 정보가 필요합니다.");
      return;
    }
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.mimetype || 'text/plain',
      } as any);
      formData.append('user_id', user.user_id);

      const res = await apiFetch(`/chat-upload/kakao-log`, {
        method: "POST",
        headers: {
          // 'Content-Type': 'multipart/form-data', // 넣지마! RN은 자동 세팅함
        },
        body: formData,
      });
      const result = await res.json();
      setUploading(false);

      if (res.ok) {
        alert("업로드 성공!\n" + "대화 내용이 업로드 되었습니다\n주간리포트를 확인해보세요!");
        setFile(null);
        onClose();
      } else {
        alert("업로드 실패: " + (result.detail || "오류"));
      }
    } catch (e) {
      setUploading(false);
      alert("네트워크 오류: " + e.message);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>카카오톡 대화내용 업로드</Text>
          <TouchableOpacity style={styles.pickButton} onPress={pickFile}>
            <Text>{file ? file.name : "txt 파일 선택"}</Text>
          </TouchableOpacity>
          <View style={{height:16}}/>
          <TouchableOpacity
            style={[styles.uploadButton, { backgroundColor: file && !uploading ? "#7493F7" : "#aaa" }]}
            onPress={uploadFile}
            disabled={!file || uploading}
          >
            {uploading ? <ActivityIndicator color="#fff"/> : <Text style={{color:'#fff'}}>업로드</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={{ color: "#888", marginTop: 16 }}>취소</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center'
  },
  modalContent: {
    backgroundColor: "#fff", borderRadius: 16, padding: 28, width: 300, alignItems: "center"
  },
  modalTitle: { fontWeight: "bold", fontSize: 18, marginBottom: 16 },
  pickButton: { borderWidth: 1, borderColor: "#bbb", borderRadius: 8, padding: 10, width: "100%", alignItems: "center" },
  uploadButton: { borderRadius: 8, padding: 13, width: "100%", alignItems: "center", marginTop: 8 },
  closeButton: { alignSelf: "center" },
});
