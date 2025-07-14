import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, Button } from "react-native";
import { useEmotionContext } from "../../context/EmotionContext";
import { emotionCharacters } from "../../constants/emotionCharacters";
import EmotionRecordFlow from "../../components/EmotionRecordFlow";
import { Calendar, DateData } from "react-native-calendars";

// 감정 캐릭터 id로 label/color 찾는 함수
function getCharacterInfo(id: string) {
  return emotionCharacters.find((ch) => ch.id === id);
}

export default function FeelingsScreen() {
  const { records, todayRecord, selectedDate, setSelectedDate } = useEmotionContext();
  const [showRecordFlow, setShowRecordFlow] = useState(!todayRecord);
  const [detailDate, setDetailDate] = useState<string | null>(selectedDate);
  const [editMode, setEditMode] = useState(false);

  // 오늘 날짜(항상 최신)
  const today = new Date().toISOString().slice(0, 10);

  // 오늘 기록 유무 변화시 자동으로 감정 기록 플로우 제어
  useEffect(() => {
    setShowRecordFlow(!todayRecord);
  }, [todayRecord]);

  // 날짜 클릭 핸들러
  const onDayPress = (day: DateData) => {
    setDetailDate(day.dateString);
    setSelectedDate(day.dateString);
    setEditMode(false); // 날짜 클릭하면 항상 수정모드 해제
  };

  // 마킹 데이터: 기록 있는 날짜만 색칠/도트
  const markedDates = Object.fromEntries(
    Object.entries(records).map(([date, record]) => [
      date,
      {
        customStyles: {
          container: {
            backgroundColor: getCharacterInfo(record.basic)?.color || "#eee",
            borderRadius: 16,
          },
          text: {
            color: "#fff",
            fontWeight: "bold" as const,
          },
        },
      },
    ])
  );

  // 현재 선택된 날짜의 기록(있으면)
  const detail = detailDate && records[detailDate] ? records[detailDate] : null;
  const charInfo = detail ? getCharacterInfo(detail.basic) : null;

  // 오늘 이전 날짜(과거) & 기록 없는 날?
  const canWritePastRecord =
    !!detailDate &&
    detailDate < today &&         // 과거 날짜
    !records[detailDate];         // 기록 없음

  return (
    <View style={{ flex: 1, paddingTop: 32 }}>
      <Calendar
        style={{ marginHorizontal: 10, borderRadius: 16 }}
        markingType="custom"
        markedDates={markedDates}
        onDayPress={onDayPress}
      />

      {/* 상세 기록 패널 */}
      <View style={styles.detailCard}>
        {detail ? (
          // 기록이 있을 때
          <>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 6 }}>
              {detail.date} 감정 기록
            </Text>
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: charInfo?.color || "#ddd",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  {charInfo?.label || detail.basic}
                </Text>
              </View>
              <Text style={{ fontSize: 16 }}>{charInfo?.label || detail.basic}</Text>
            </View>
            <Text style={{ fontSize: 15, marginBottom: 5 }}>
              세부 감정: {detail.details.join(", ")}
            </Text>
            <Text style={{ color: "#888", fontSize: 12, marginBottom: 8 }}>
              기록 시간: {detail.time}
            </Text>
            <Button title="수정" onPress={() => setEditMode(true)} />
          </>
        ) : (
          // 기록이 없을 때
          <>
            <Text style={{ color: "#bbb", marginTop: 14 }}>
              날짜를 선택하면 감정 기록이 표시됩니다.
            </Text>
            {/* 👉 과거 & 기록 없는 날에는 "감정 기록하기" 버튼 노출 */}
            {canWritePastRecord && (
              <View style={{ marginTop: 16, alignItems: "center" }}>
                <Button title="감정 기록하기" onPress={() => setEditMode(true)} />
              </View>
            )}
          </>
        )}
      </View>

      {/* 오늘 감정 기록이 없고 플로우가 안 열려 있을 때 진입 버튼(오늘만!) */}
      {!todayRecord && !showRecordFlow && !editMode && detailDate === today && (
        <View style={{ marginTop: 28, alignItems: "center" }}>
          <Button title="감정 기록하기" onPress={() => setShowRecordFlow(true)} />
        </View>
      )}

      {/* 감정 기록 플로우(모달, 입력·수정 모두 지원) */}
      <Modal
        visible={showRecordFlow || editMode}
        animationType="slide"
        transparent={false}
      >
        <View style={styles.modalWrap}>
          <EmotionRecordFlow
            // editMode면 editDate로, 아니면 undefined(오늘)
            editDate={editMode ? (detailDate ?? undefined) : undefined}
            onComplete={() => {
              setShowRecordFlow(false);
              setEditMode(false);
            }}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  detailCard: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 18,
    padding: 16,
    minHeight: 120,
    elevation: 2,
    shadowColor: "#222",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  modalWrap: {
    flex: 1,
    backgroundColor: "#fff", // 완전히 불투명!
    justifyContent: "center",
    alignItems: "center",
  },
});
