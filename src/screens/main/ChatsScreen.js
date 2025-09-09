// src/screens/main/ChatsScreen.js
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import ChatListItem from '../../components/ChatListItem';

const SEGMENTS = ['전체', '읽지 않음', '신규', '즐겨찾기'];

export default function ChatsScreen({ navigation }) {
  const [seg, setSeg] = useState(0);

  const data = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: ['여행', '수별', '같이', '포에', '시얏'][i % 5],
        avatar: `https://i.pravatar.cc/150?img=${(i % 60) + 1}`,
        snippet: ['주말에 시간 괜찮으세요?', '사진 고마워요 :)', '네! 확인했습니다', '헬스 같이 하실래요?', '안녕하세요!'][i % 5],
        timeLabel: ['4분', '1시간', '17시간', '2일', '6시간'][i % 5],
        regionLabel: ['서울', '대전', '대전', '울산', '서울'][i % 5],
        distanceKm: [7, 132, 270, 22, 233][i % 5],
        unread: [2, 0, 1, 0, 3][i % 5],
        online: [true, false, true, false, false][i % 5],
        pinned: i % 7 === 0,
      })),
    [seg]
  );

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>대화</Text>

        {/* ➕ 채팅방 만들기 */}
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateChat')}
          hitSlop={8}
          style={styles.headerRightBtn}
        >
          <Ionicons name="add-circle" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* 세그먼트 */}
      <View style={styles.segWrap}>
        {SEGMENTS.map((label, i) => {
          const on = i === seg;
          return (
            <TouchableOpacity
              key={label}
              style={[styles.seg, on && styles.segOn]}
              onPress={() => setSeg(i)}
              activeOpacity={0.9}
            >
              <Text style={[styles.segTxt, on && styles.segTxtOn]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 채팅 리스트 */}
      <FlatList
        data={data}
        keyExtractor={(it) => String(it.id)}
        renderItem={({ item }) => (
          <ChatListItem
            item={item}
            onPress={() => navigation.navigate('ChatRoom', { id: item.id })}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
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
  headerRightBtn: { padding: 4 },

  segWrap: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 14 },
  seg: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: colors.pillBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segOn: { backgroundColor: colors.pillActiveBg, borderColor: colors.pillActiveBorder },
  segTxt: { color: colors.textSecondary, fontWeight: '700' },
  segTxtOn: { color: colors.primary },
});
