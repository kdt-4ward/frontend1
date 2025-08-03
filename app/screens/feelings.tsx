import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from "react-native";
import { emotionCharacters } from "../../constants/emotionCharacters";
import EmotionRecordModal from '../modal/EmotionRecordModal';
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { useAtom } from "jotai";
import { recordsAtom, todayRecordAtom, selectedDateAtom, loadingAtom } from "../../atoms/emotionAtoms";
import { router } from "expo-router";

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
            backgroundColor: "#E6ECFF",
            borderRadius: 10,
          },
          text: {
            color: "#7493F7",
            fontWeight: "800",
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
            borderRadius: 10
          },
          text: {
            color: "#bbb",
            fontWeight: "500",
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
    <View style={styles.container}>
      <View style={styles.calendarBox}>
        <Calendar
          monthFormat={'yyyy년 M월'}
          style={styles.calendar}
          markingType="custom"
          markedDates={markedDates}
          onDayPress={onDayPress}
          theme={{
            backgroundColor: "#fff",
            calendarBackground: "#fff",
            textSectionTitleColor: "#2650db",  // 요일 색
            textSectionTitleDisabledColor: "#bbb",
            selectedDayBackgroundColor: "#7493F7",
            selectedDayTextColor: "#fff",
            todayTextColor: "#F978B6",
            dayTextColor: "#5c5c5c",
            textDisabledColor: "#bbb",
            arrowColor: "#7493F7",
            monthTextColor: "#0d37c3",
            textMonthFontWeight: 700,
            textMonthFontSize: 20,
            textDayFontWeight: 500,
            textDayHeaderFontWeight: 600,
            textDayFontSize: 15,
            textDayHeaderFontSize: 15,
          }}
          dayComponent={({ date, state }) => {
            const dateStr = date.dateString;
            const record = records[dateStr];
            const charInfo = record ? getCharacterInfo(record.basic) : null;
            const isSelected = dateStr === selectedDate && record;
            const customStyle = markedDates[dateStr]?.customStyles;
            const isToday = dateStr === today;

            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  const [year, month, day] = dateStr.split('-').map(Number);
                  onDayPress({
                    dateString: dateStr,
                    year,
                    month,
                    day,
                    timestamp: new Date(dateStr).getTime(),
                  });
                }}
                style={[
                  {
                    alignItems: "center",
                    justifyContent: "flex-start",
                    minHeight: isToday ? 0 : 60,
                    marginVertical: -6,
                    padding: 10,
                    backgroundColor: isSelected
                      ? "#E6ECFF"
                      : (customStyle?.container?.backgroundColor ?? "transparent"),
                    borderRadius: 10,
                  }
                ]}
              >
                <Text
                  style={{
                    color: isSelected
                      ? "#7493F7"
                      : (customStyle?.text?.color
                          ?? (state === "disabled"
                            ? "#bbb"
                            : "#5c5c5c")),
                    fontWeight: isSelected
                      ? 800
                      : (customStyle?.text?.fontWeight ?? 500),
                    fontSize: 15,
                    marginBottom: charInfo ? 2 : 0,
                  }}
                >
                  {date.day}
                </Text>
                <Image
                  source={charInfo && charInfo.imagePath}
                  style={{
                    width: 22,
                    height: 22,
                    marginTop: 1,
                    borderRadius: 8,
                    opacity: charInfo ? (state === "disabled" ? 0.35 : 1) : 0,
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            );
          }}
        />
      </View>

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
              <Ionicons name="pencil" size={22} color="#7493F7" />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, paddingRight: 38, color: '#7493F7' }}>
              {formatMonthDay(detail.date)}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}>
                <Image source={charInfo?.imagePath} style={styles.emoji} resizeMode="contain" />
              </View>
              {detail.details.map((i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{i}</Text>
                </View>
              ))}
            </View>
            {detail.memo && (
              <Text style={{ fontSize: 15, color: "#333", marginBottom: 7 }}>
                {detail.memo}
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
      <EmotionRecordModal
        visible={showRecordFlow || editMode}
        onClose={() => {
          setShowRecordFlow(false);
          setEditMode(false);
        }}
        editDate={editMode ? (detailDate ?? undefined) : undefined}
      />
    </View>
  );
}
// getCharacterInfo(record.basic)?.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    backgroundColor: '#F6F8FF',
    width: '100%',
  },
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
    width: '100%',
  },
  calendarBox: {
    
  },
  calendar: {
    marginHorizontal: 15,
    borderRadius: 15,
    borderWidth: 10,
    borderColor: '#E6ECFF',
    backgroundColor: "#fff",
    // elevation: 5,
    // shadowColor: "#7493F7",
    // shadowOpacity: 0.08,
    // shadowRadius: 12,
    // shadowOffset: { width: 0, height: 3 } 
  },
  emoji: {
    width: 45, 
    height: 45,
  },
  tag: {
    backgroundColor: "#E6ECFF", paddingHorizontal: 10, paddingVertical: 8,
    borderRadius: 16,
  },
  tagText: { color: "#7493F7", fontSize: 14, fontWeight: 600 },
});
