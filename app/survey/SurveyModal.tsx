import React, { useState } from 'react';
import { Modal, View, Text, Button, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SURVEY_QUESTIONS } from './surveyQuestions';
import { backendBaseUrl } from '@/constants/app.constants';

export default function SurveyModal({ visible, onComplete, userId }: { visible: boolean; onComplete: () => void; userId: string }) {
  const [answers, setAnswers] = useState<{ [questionCode: string]: { choice: string; custom?: string } }>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSelect = (qCode: string, value: string) => {
    setAnswers(prev => ({ ...prev, [qCode]: { ...prev[qCode], choice: value, custom: "" } }));
  };

  const handleCustomInput = (qCode: string, text: string) => {
    setAnswers(prev => ({ ...prev, [qCode]: { ...prev[qCode], custom: text, choice: "custom" } }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    for (const [idx, q] of SURVEY_QUESTIONS.entries()) {
      const ans = answers[q.code];
      if (!ans?.choice) {
        alert(`"${q.question}"에 답해주세요.`);
        setSubmitting(false);
        return;
      }
      await fetch(`${backendBaseUrl}/survey/response`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          question_id: idx + 1, // 서버의 question_id와 매핑!
          choice_id: ans.choice !== "custom" ? Number(ans.choice) + (idx * 6) : null,
          custom_input: ans.choice === "custom" ? ans.custom : null,
        })
      });
    }
    setSubmitting(false);
    onComplete();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>연애 성향 핵심 질문</Text>
        {SURVEY_QUESTIONS.map((q, idx) => (
          <View key={q.code} style={{ marginBottom: 24 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>{idx + 1}. {q.question}</Text>
            {q.choices.map(choice => (
              <TouchableOpacity key={choice.value} onPress={() => handleSelect(q.code, choice.label)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  <View style={{
                    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#ccc', marginRight: 10,
                    backgroundColor: answers[q.code]?.choice === choice.label ? "#f7e5a6" : "white"
                  }} />
                  <Text>{choice.text}</Text>
                </View>
              </TouchableOpacity>
            ))}
            {answers[q.code]?.choice === "6" && (
              <TextInput
                value={answers[q.code]?.custom || ""}
                onChangeText={text => handleCustomInput(q.code, text)}
                placeholder="직접 입력"
                style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 7, padding: 6, marginTop: 8 }}
              />
            )}
          </View>
        ))}
        <Button title={submitting ? "제출 중..." : "제출하기"} onPress={handleSubmit} disabled={submitting} />
      </ScrollView>
    </Modal>
  );
}
