// src/screens/main/ChatsScreen.js
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import ChatListItem from '../../components/ChatListItem';

const SEGMENTS = ['전체', '읽지 않음', '신규', '즐겨찾기'];

export default function ChatsScreen({ navigation }) {
  const [seg, setSeg] = useState(0);

  // TODO: 실제 API 연동
  const data = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: ['은별', '아라', '사라', '윤아', '나리'][i % 5],
        age: [22, 27, 31, 29, 34][i % 5],
        points: [0, 30, 5, 80, 0][i % 5],
        snippet: '대화해요!',
        timeLabel: ['방금', '1시간', '17시간', '2일', '6시간'][i % 5],
        regionLabel: ['서초', '수서', '대전', '울산', '서울'][i % 5],
        distanceKm: [3, 18, 42, 5, 16][i % 5],
        unread: [0, 1, 0, 2, 0][i % 5],
      })),
    [seg]
  );

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>대화</Text>
        <View style={{ width: 24 }} />
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

      {/* 리스트 */}
      <FlatList
        data={data}
        keyExtractor={(it) => String(it.id)}
        renderItem={({ item }) => (
          <ChatListItem
            item={item}
            onPress={() => navigation.navigate('ChatRoom', { id: item.id })}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 16, backgroundColor: colors.background }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, paddingVertical: 12,
    backgroundColor: colors.backgroundSecondary, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: colors.text },

  segWrap: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.background },
  seg: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 18,
    backgroundColor: colors.pillBg, borderWidth: 1, borderColor: colors.border,
  },
  segOn: { backgroundColor: colors.pillActiveBg, borderColor: colors.pillActiveBorder },
  segTxt: { color: colors.textSecondary, fontWeight: '700' },
  segTxtOn: { color: colors.primary, fontWeight: '800' },
});
