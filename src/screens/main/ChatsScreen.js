// src/screens/main/ChatsScreen.js
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import ChatListItem from '../../components/ChatListItem';

const SEGMENTS = ['HOT추천', '내주변', '접속중', '단순대화'];

export default function ChatsScreen({ navigation }) {
  const [seg, setSeg] = useState(0);

  // TODO: 실제 API 연동 시 seg 값 기준으로 서버 필터 적용
  const data = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: ['여행을좋아하는수아', '수별윤', '같이노후를살아요', '달콤만초콜렛', '나윤희나윤희'][i % 5],
        age: [26, 45, 47, 40, 50][i % 5],
        points: [0, 5, 5, 90, 40][i % 5],
        preview:
          ['주말에 시간 괜찮으세요?', '사진 고민중이요…', '네! 확인했습니다', '헷.. 같이 하실래요?', '바로 만나고 싶어요'][i % 5],
        avatar: `https://i.pravatar.cc/150?img=${(i % 60) + 1}`,
        lastSeenLabel: ['1일', '4분', '17시간', '2일', '6시간'][i % 5],
        regionLabel: ['서울', '대전', '대전', '울산', '서울'][i % 5],
        distanceKm: [7, 132, 137, 270, 233][i % 5],
        online: i % 2 === 0,
        unread: i % 3 === 0 ? 2 : 0,
        pinned: i % 7 === 0,
      })),
    [seg]
  );

  return (
    <View style={styles.container}>
      {/* 헤더: HotRecommend 와 동일한 구조/타이포 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>대화</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.85}>
            <Ionicons name="search" size={18} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.85}>
            <Ionicons name="create" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 세그먼트(알약) – HotRecommend 의 스타일 매칭 */}
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

      {/* 리스트 */}
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        keyExtractor={(it) => String(it.id)}
        renderItem={({ item }) => (
          <ChatListItem
            item={item}
            onPress={() => navigation.navigate('ChatRoom', { id: item.id })}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={<View style={{ height: 6 }} />}
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
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

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
