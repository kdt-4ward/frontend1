import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Button, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { SURVEY_QUESTIONS } from '../../constants/surveyQuestions';
import { backendBaseUrl } from '@/constants/app.constants';
import { BlurView } from "expo-blur";

export default function SurveyModal({ visible, onComplete, userId }: { visible: boolean; onComplete: () => void; userId: string }) {
  const [answers, setAnswers] = useState<{ [question_id: number]: { choice_id?: number; custom_input?: string } }>({});
  const [loading, setLoading] = useState(false);

  const [currentIdx, setCurrentIdx] = useState(0); // ★ 현재 질문 인덱스

  const total = SURVEY_QUESTIONS.length;
  const question = SURVEY_QUESTIONS[currentIdx];

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
      // 유효성 검사
      for (const q of SURVEY_QUESTIONS) {
        if (!answers[q.id]?.choice_id) {
          alert(`"${q.question}"에 답해주세요.`);
          setLoading(false);
          setCurrentIdx(SURVEY_QUESTIONS.findIndex(qq => qq.id === q.id)); // 미응답 질문으로 이동
          return;
        }
        if (answers[q.id]?.choice_id === 6 && !answers[q.id]?.custom_input) {
          alert(`"${q.question}"의 기타 답변을 입력해주세요.`);
          setLoading(false);
          setCurrentIdx(SURVEY_QUESTIONS.findIndex(qq => qq.id === q.id));
          return;
        }
      }
      // 응답 리스트 변환
      const answerList = SURVEY_QUESTIONS.map(q => ({
        user_id: userId,
        question_id: q.id,
        choice_id: answers[q.id].choice_id !== 6 ? answers[q.id].choice_id : null,
        custom_input: answers[q.id].choice_id === 6 ? answers[q.id].custom_input : null,
      }));

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

      alert("연애 가치관 설문이 제출 완료 됐어요!");
      onComplete();
    } catch (e: any) {
      alert(`에러 발생: ${e?.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!answers[question.id]?.choice_id) {
      alert("답변을 선택해주세요.");
      return;
    }
    if (answers[question.id]?.choice_id === 6 && !answers[question.id]?.custom_input) {
      alert("기타 답변을 입력해주세요.");
      return;
    }
    if (currentIdx < total - 1) setCurrentIdx(currentIdx + 1);
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalWrap}>
        <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.container}>
          <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 30}}>
            <Text style={styles.title}>나의 연애 가치관 탐색</Text>
            <Text style={{color:"#666", fontSize:14, fontWeight:500, textAlign:'right'}}>
              {currentIdx + 1} / {total}
            </Text>
          </View>
          <View style={styles.questionBox}>
            <Text style={styles.question}>Q{question.id}. {question.question}</Text>
            {question.choices.map(choice => (
              <TouchableOpacity
                key={choice.value}
                onPress={() => handleSelect(question.id, choice.id)}
              >
                <View style={[
                  styles.choiceBox,
                  answers[question.id]?.choice_id === choice.id && styles.selected
                ]}>
                  <Text style={[styles.choiceText, answers[question.id]?.choice_id === choice.id && { color: '#fff'}]}>{choice.text}</Text>
                </View>
              </TouchableOpacity>
            ))}
            {answers[question.id]?.choice_id === 6 && (
              <TextInput
                value={answers[question.id]?.custom_input || ""}
                onChangeText={text => handleCustomInput(question.id, text)}
                placeholder="직접 입력"
                style={styles.input}
              />
            )}
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
            <TouchableOpacity
              onPress={handlePrev}
              disabled={currentIdx === 0}
              style={[
                styles.navBtn,
                { opacity: currentIdx === 0 ? 0.5 : 1 }
              ]}
            >
              <Text style={{fontSize:14}}>이전</Text>
            </TouchableOpacity>

            {currentIdx === total - 1 ? (
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.navBtn}
                disabled={loading}
              >
                <Text style={{fontWeight:500, fontSize:14}}>{loading ? "제출 중..." : "제출하기"}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleNext}
                style={styles.navBtn}
              >
                <Text style={{fontSize:14}}>다음</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: "center" },
  container: { backgroundColor: "rgba(255, 255, 255, 0.7)", borderRadius: 18, margin: 20, paddingHorizontal: 24, paddingVertical: 40 },
  title: { fontSize: 21, fontWeight: "bold", color: '#000' },
  questionBox: { marginBottom: 18 },
  question: { fontSize: 15, marginBottom: 20, fontWeight: 500 },
  choiceBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderRadius: 12, borderColor: '#ffffff', padding: 11 },
  choiceText: {fontSize: 14, fontWeight: 500, color: '#777777'},
  selected: { backgroundColor: "#7493F7", borderColor:'#7493F7' },
  navBtn: { paddingVertical: 10, backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: 9, minWidth: 80, alignItems: "center" },
  input: { borderWidth: 1, borderColor: "#fff", borderRadius: 12, padding: 11, marginTop: 6 }
});
