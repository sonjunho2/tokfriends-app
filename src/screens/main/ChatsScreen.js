// src/screens/main/ChatsScreen.js
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';

// HOT추천 화면과 같은 필터(알약) 형태로 구성
const PILL_ITEMS = ['HOT추천', '내주변', '접속중', '단순대화'];

const MOCK_CHATS = [
  {
    id: 'c1',
    name: '여행을좋아하는수아',
    age: 26,
    point: 0,
    preview: '오랜 얘기하고 싶어요 부모님이랑 살고 있어요',
    timeBadge: '1일',
    location: '서울',
    distanceKm: 7,
    online: true,
    unread: 2,
    pinned: true,
  },
  {
    id: 'c2',
    name: '수별윤',
    age: 45,
    point: 5,
    preview: '사진 고민중이요…',
    timeBadge: '4분',
    location: '대전',
    distanceKm: 132,
    online: false,
    unread: 0,
  },
  {
    id: 'c3',
    name: '같이노후를살아요',
    age: 47,
    point: 5,
    preview: '먼저 알아가봐야 할거 같아요 잠시 여행와있어요',
    timeBadge: '17시간',
    location: '대전',
    distanceKm: 137,
    online: true,
    unread: 1,
  },
  {
    id: 'c4',
    name: '달콤만초콜렛',
    age: 40,
    point: 90,
    preview: '잘 모르겠어요 부모님이랑 살고 있어요',
    timeBadge: '2일',
    location: '울산',
    distanceKm: 270,
    online: false,
    unread: 0,
  },
];

export default function ChatsScreen({ navigation }) {
  const [activePill, setActivePill] = useState(PILL_ITEMS[0]);

  const data = useMemo(() => {
    // 실제에선 activePill 기준 서버 필터를 적용하세요.
    return MOCK_CHATS;
  }, [activePill]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate('ChatRoom', { id: item.id })}
      style={styles.rowWrap}
    >
      <View style={styles.avatarWrap}>
        <Avatar name={item.name} size="medium" />
        {/* 온라인 점 */}
        <View
          style={[
            styles.dot,
            { backgroundColor: item.online ? '#22C55E' : '#9AA2AF' },
          ]}
        />
      </View>

      <View style={styles.rowMain}>
        {/* 타이틀: 닉네임, 나이, 포인트 */}
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={styles.title}>
            {item.name}, {item.age}
          </Text>
          {!!item.point && <Text style={styles.point}>{item.point}P</Text>}
          {item.pinned && (
            <Ionicons
              name="flag"
              size={14}
              color={colors.primary}
              style={{ marginLeft: 6 }}
            />
          )}
        </View>

        {/* 미리보기 1줄 */}
        <Text numberOfLines={1} style={styles.preview}>
          {item.preview}
        </Text>

        {/* 배지줄: 시간, 위치/거리 */}
        <View style={styles.badgeRow}>
          <View style={[styles.badge, styles.badgePink]}>
            <Text style={styles.badgePinkText}>{item.timeBadge}</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons
              name="location"
              size={12}
              color={colors.textSecondary}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.badgeText}>
              {item.location} · {item.distanceKm}km
            </Text>
          </View>
        </View>
      </View>

      {/* 우측 상태: 미확인 수/읽음 */}
      <View style={styles.rightCol}>
        {item.unread > 0 ? (
          <View style={styles.unreadBubble}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        ) : (
          <Text style={styles.readText}>읽음</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 (HOT추천 화면과 동일한 서체/정렬 느낌) */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>대화</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="search" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="create" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 알약 필터 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsWrap}
      >
        {PILL_ITEMS.map((p) => {
          const on = p === activePill;
          return (
            <TouchableOpacity
              key={p}
              style={[styles.pill, on && styles.pillOn]}
              onPress={() => setActivePill(p)}
              activeOpacity={0.9}
            >
              <Text style={[styles.pillTxt, on && styles.pillTxtOn]}>{p}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 리스트 */}
      <FlatList
        data={data}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={<View style={{ height: 6 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // 헤더
  header: {
    height: 52,
    paddingHorizontal: 16,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginLeft: 8,
  },

  // 필터(알약)
  pillsWrap: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pill: {
    marginRight: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: colors.pillBg || '#F5F6F8',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillOn: {
    backgroundColor: '#fff',
    borderColor: colors.pillActiveBorder || colors.primary,
  },
  pillTxt: { color: colors.textSecondary, fontWeight: '700', fontSize: 13 },
  pillTxtOn: { color: colors.text, fontWeight: '800' },

  // 행(아이템)
  rowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  avatarWrap: { marginRight: 12 },
  dot: {
    position: 'absolute',
    bottom: 6,
    right: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  rowMain: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '800', color: colors.text },
  point: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  preview: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F7F8FA',
    borderRadius: 8,
  },
  badgeText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  badgePink: { backgroundColor: '#FDE7EE' },
  badgePinkText: { color: colors.primary, fontSize: 12, fontWeight: '800' },

  rightCol: { marginLeft: 8, alignItems: 'flex-end' },
  unreadBubble: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  readText: { color: colors.textTertiary, fontSize: 12 },
});
