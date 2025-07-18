import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { emotionCharacters } from "../../constants/emotionCharacters";
import EmotionRecordFlow from "../../components/EmotionRecordFlow";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { useAtom } from "jotai";
import { recordsAtom, todayRecordAtom, selectedDateAtom, loadingAtom } from "../../atoms/emotionAtoms";

LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ],
  monthNamesShort: [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ],
  dayNames: [
    '일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘'
};
LocaleConfig.defaultLocale = 'ko';

function formatMonthDay(dateStr: string) {
  // dateStr: '2025-07-15'
  const [year, month, day] = dateStr.split("-");
  return `${parseInt(month, 10)}월 ${parseInt(day, 10)}일`;
}

// 감정 캐릭터 id로 label/color 찾는 함수
function getCharacterInfo(id: string) {
  return emotionCharacters.find((ch) => ch.id === id);
}

export default function FeelingsScreen() {
  const [records] = useAtom(recordsAtom);
  const [todayRecord] = useAtom(todayRecordAtom);
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const [loading, setLoading] = useAtom(loadingAtom);

  const [showRecordFlow, setShowRecordFlow] = useState(false);
  const [detailDate, setDetailDate] = useState<string | null>(selectedDate);
  const [editMode, setEditMode] = useState(false);

  // 오늘 날짜(항상 최신)
  const today = new Date().toISOString().slice(0, 10);




  // 오늘 기록 유무 변화시 자동으로 감정 기록 플로우 제어
  useEffect(() => {
    if (loading) {
      setShowRecordFlow(false);
      return;
    }
    setShowRecordFlow(!todayRecord);
  }, [todayRecord]);

  // 날짜 클릭 핸들러
  const onDayPress = (day: DateData) => {
    if (day.dateString > today) return; // 오늘 이후면 아무 동작도 안 함

    setDetailDate(day.dateString);
    setSelectedDate(day.dateString);
    if (!records[day.dateString]) {
      setEditMode(true); // ← 이 코드만 추가!
    } else {
      setEditMode(false);
    }  };

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
  // 31일까지 반복해서 오늘 이후 날짜면 스타일 추가
  for (let i = 1; i <= 365; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const ds = date.toISOString().slice(0, 10);
    if (!markedDates[ds]) {
      markedDates[ds] = {
        customStyles: {
          container: {
            backgroundColor: "transparent",
            borderRadius: 16
          },
          text: {
            color: "#bbb",
            fontWeight: "bold"
          }
        }
      };
    }
}
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
        monthFormat={'yyyy년 M월'}
        style={{ 
          marginHorizontal: 12,
          borderRadius: 22,
          backgroundColor: "#fff",
          elevation: 5,
          shadowColor: "#4077F3",
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 3 } 
        }}
        markingType="custom"
        markedDates={markedDates}
        onDayPress={onDayPress}
        theme={{
          backgroundColor: "#fff",
          calendarBackground: "#fff",
          textSectionTitleColor: "#222",  // 요일 색
          textSectionTitleDisabledColor: "#bbb",
          selectedDayBackgroundColor: "#4077F3",
          selectedDayTextColor: "#fff",
          todayTextColor: "#ff6347",
          dayTextColor: "#222",
          textDisabledColor: "#bbb",
          arrowColor: "#4077F3",
          monthTextColor: "#2b3f6c",
          textMonthFontWeight: "bold",
          textMonthFontSize: 20,
          textDayFontWeight: "600",
          textDayHeaderFontWeight: "bold",
          textDayFontSize: 16,
          textDayHeaderFontSize: 15,
            }}
      />

      {/* 상세 기록 패널 */}
      <View style={styles.detailCard}>
        {detail ? (
          // 기록이 있을 때
          <>
            <TouchableOpacity
              onPress={() => setEditMode(true)}
              style={{position: "absolute", top: 14, right: 14, zIndex: 2}}
              hitSlop={10}
            >
              <Ionicons name="pencil" size={22} color="#4077F3" />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 6, paddingRight: 38 }}>
              {formatMonthDay(detail.date)}
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
              {detail.details.join(", ")}
            </Text>
            {detail.memo && (
              <Text style={{ fontSize: 15, color: "#406", marginBottom: 7 }}>
                Memo: {detail.memo}
              </Text>
            )}
          </>
        ) : (
          // 기록이 없을 때
          <>
            <Text style={{ color: "#bbb", marginTop: 14 }}>
              날짜를 선택하면 감정 기록이 표시됩니다.
            </Text>
          </>
        )}
      </View>

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
