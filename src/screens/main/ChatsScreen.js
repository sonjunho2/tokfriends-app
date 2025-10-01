// src/screens/main/ChatsScreen.js
import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import ChatListItem from '../../components/ChatListItem';

const SEGMENTS = ['전체', '읽지 않음', '신규', '즐겨찾기'];

export default function ChatsScreen({ navigation, route }) {
  // route.params.initialSeg 로 초기 탭을 지정할 수 있게 함 (예: '신규', '전체' 등)
  const initialIndex = Math.max(
    0,
    SEGMENTS.findIndex((s) => s === route?.params?.initialSeg)
  );
  const [seg, setSeg] = useState(initialIndex >= 0 ? initialIndex : 0);

  // 다른 화면에서 넘어오며 params가 갱신될 때도 반영
  useEffect(() => {
    if (route?.params?.initialSeg) {
      const idx = SEGMENTS.findIndex((s) => s === route.params.initialSeg);
      if (idx >= 0) setSeg(idx);
    }
  }, [route?.params?.initialSeg]);

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

    const canGoBack = navigation.canGoBack();
  
  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerSide}>
          {canGoBack && (
            <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
              <Ionicons name="chevron-back" size={26} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.headerTitle}>대화</Text>
        <View style={styles.headerSideRight}>
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateChatRoom')}
            hitSlop={8}
            style={styles.createBtn}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={18} color={colors.textInverse} />
            <Text style={styles.createBtnTxt}>방 만들기</Text>
          </TouchableOpacity>
        </View>
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
            onPress={() =>
              navigation.navigate('ChatRoom', {
                id: item.id,
                user: item,
              })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
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
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerSide: { width: 40, alignItems: 'flex-start', justifyContent: 'center' },
  headerSideRight: { minWidth: 40, alignItems: 'flex-end', justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '900', color: colors.text },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  createBtnTxt: { color: colors.textInverse, fontWeight: '800', fontSize: 13 },
  segWrap: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: colors.background,
  },
  seg: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: colors.pillBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segOn: { backgroundColor: colors.pillActiveBg, borderColor: colors.pillActiveBorder },
  segTxt: { color: colors.textSecondary, fontWeight: '700', fontSize: 13 },
  segTxtOn: { color: colors.primary, fontWeight: '800' },
    listContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
    paddingTop: 4,
    backgroundColor: colors.background,
  },
});
