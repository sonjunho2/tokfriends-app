// src/screens/main/ChatsScreen.js
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import ChatListItem from '../../components/ChatListItem';
import SegmentBar, { DEFAULT_SEGMENTS } from '../../components/SegmentBar';

// 보조 필터(읽음 상태 등)는 화면 내 작은 칩으로 유지
const SUB_FILTERS = ['전체', '읽지 않음', '신규', '즐겨찾기'];

export default function ChatsScreen({ navigation, route }) {
  // 상단 공용 세그먼트(탐색/추천과 동일)
  const initialSeg =
    route?.params?.selected && DEFAULT_SEGMENTS.includes(route.params.selected)
      ? route.params.selected
      : '전체';
  const [seg, setSeg] = useState(initialSeg);

  // 작은 보조 필터 (채팅 전용)
  const [subFilter, setSubFilter] = useState('전체');

  // TODO: 실제 API 연동
  const data = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: ['여행', '수별', '같이', '포에', '시얏'][i % 5],
        avatar: `https://i.pravatar.cc/150?img=${(i % 60) + 1}`,
        preview: ['주말에 시간 괜찮으세요?', '사진 고마워요 :)', '네! 확인했습니다', '헬스 같이 하실래요?', '안녕하세요!'][i % 5],
        lastSeenLabel: ['4분', '1시간', '17시간', '2일', '6시간'][i % 5],
        regionLabel: ['서울', '대전', '대전', '울산', '서울'][i % 5],
        distanceKm: [7, 132, 270, 22, 233][i % 5],
        unread: [2, 0, 1, 0, 3][i % 5],
        online: [true, false, true, false, false][i % 5],
        pinned: i % 7 === 0,
        age: [23, 27, 21, 29, 24][i % 5],
        points: [0, 10, 0, 0, 5][i % 5],
      })),
    [seg, subFilter]
  );

  return (
    <View style={styles.container}>
      {/* 가운데 타이틀 헤더 (HOT추천/탐색과 동일 레이아웃) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>대화</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* 상단 공용 세그먼트 바 */}
      <SegmentBar value={seg} onChange={setSeg} />

      {/* 보조 필터 칩 (채팅 전용) */}
      <View style={styles.subFilterRow}>
        {SUB_FILTERS.map((label) => {
          const on = subFilter === label;
          return (
            <TouchableOpacity
              key={label}
              onPress={() => setSubFilter(label)}
              activeOpacity={0.9}
              style={[styles.subPill, on && styles.subPillOn]}
            >
              <Text style={[styles.subPillTxt, on && styles.subPillTxtOn]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 채팅 리스트 (여백/톤 HOT추천과 동일) */}
      <FlatList
        data={data}
        keyExtractor={(it) => String(it.id)}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
            <ChatListItem
              item={item}
              onPress={() => navigation.navigate('ChatRoom', { id: item.id })}
            />
          </View>
        )}
        contentContainerStyle={{ paddingTop: 6, paddingBottom: 12 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: colors.text },

  subFilterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  subPill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: colors.pillBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subPillOn: {
    backgroundColor: colors.pillActiveBg,
    borderColor: colors.pillActiveBorder,
  },
  subPillTxt: { color: colors.textSecondary, fontWeight: '700' },
  subPillTxtOn: { color: colors.primary },
});
