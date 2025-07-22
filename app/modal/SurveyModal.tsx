import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Button, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { SURVEY_QUESTIONS } from '../../constants/surveyQuestions';
import { backendBaseUrl } from '@/constants/app.constants';

export default function SurveyModal({ visible, onComplete, userId }: { visible: boolean; onComplete: () => void; userId: string }) {
  const [answers, setAnswers] = useState<{ [question_id: number]: { choice_id?: number; custom_input?: string } }>({});
  const [loading, setLoading] = useState(false);

  const handleSelect = (qId: number, cId: number) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: { choice_id: cId, custom_input: cId === 6 ? prev[qId]?.custom_input || "" : undefined },
    }));
  };

  const handleCustomInput = (qId: number, text: string) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: { ...prev[qId], custom_input: text }
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 1. 유효성 체크
      for (const q of SURVEY_QUESTIONS) {
        if (!answers[q.id]?.choice_id) {
          alert(`"${q.question}"에 답해주세요.`);
          setLoading(false);
          return;
        }
        if (answers[q.id]?.choice_id === 6 && !answers[q.id]?.custom_input) {
          alert(`"${q.question}"의 기타 답변을 입력해주세요.`);
          setLoading(false);
          return;
        }
      }
      // 2. 응답 리스트 변환
      const answerList = SURVEY_QUESTIONS.map(q => ({
        user_id: userId,
        question_id: q.id,
        choice_id: answers[q.id].choice_id !== 6 ? answers[q.id].choice_id : null,
        custom_input: answers[q.id].choice_id === 6 ? answers[q.id].custom_input : null,
      }));
      console.log("answerList: ", answerList);

      // 3. POST 한번에!
      const res = await fetch(`${backendBaseUrl}/survey/response`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answerList),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(`[제출 실패] ${error.detail || "서버 오류"}`);
        setLoading(false);
        return;
      }

      alert("설문이 성공적으로 제출되었습니다!");
      onComplete();
    } catch (e: any) {
      alert(`에러 발생: ${e?.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalWrap}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>연애 성향 핵심 질문</Text>
          {SURVEY_QUESTIONS.map((q) => (
            <View key={q.code} style={styles.questionBox}>
              <Text style={styles.question}>{q.id}. {q.question}</Text>
              {q.choices.map(choice => (
                <TouchableOpacity
                  key={choice.value}
                  onPress={() => handleSelect(q.id, choice.id)}
                  >
                  <View style={styles.choiceBox}>
                    <View style={[
                      styles.choiceCircle,
                      answers[q.id]?.choice_id === choice.id && styles.selected
                    ]} />
                    <Text>{choice.text}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              {answers[q.id]?.choice_id === 6 && (
                <TextInput
                  value={answers[q.id]?.custom_input || ""}
                  onChangeText={text => handleCustomInput(q.id, text)}
                  placeholder="직접 입력"
                  style={styles.input}
                />
              )}
            </View>
          ))}
          <Button title={loading ? "제출 중..." : "제출하기"} onPress={handleSubmit} disabled={loading} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: "center" },
  container: { backgroundColor: "#fff", borderRadius: 18, margin: 20, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  questionBox: { marginBottom: 18 },
  question: { fontSize: 15, marginBottom: 5 },
  choiceBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  choiceCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#ccc', marginRight: 10, backgroundColor: "white" },
  choice: { padding: 10, backgroundColor: "#eee", borderRadius: 8, marginVertical: 2 },
  selected: { backgroundColor: "#fce8b2" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 6, padding: 8, marginTop: 6 }
});
