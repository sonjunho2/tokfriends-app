// src/screens/main/ChatsScreen.js
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';

// ──────────────────────────────────────────────────────────────
// 상단 알약 필터 (탐색/HOT추천과 같은 느낌)
// ──────────────────────────────────────────────────────────────
const FILTERS = ['전체', '읽지 않음', '신규', '즐겨찾기'];

// 샘플 대화방 데이터 (API 연결 전까지 UI 확인용)
const MOCK = [
  {
    id: 'c1',
    name: '여행을좋아하는수아',
    last: '주말에 시간 괜찮으세요?',
    time: '4분',
    region: '서울',
    dist: 7,
    unread: 3,
    pinned: true,
    online: true,
  },
  {
    id: 'c2',
    name: '수별윤',
    last: '사진 고마워요 :)',
    time: '1시간',
    region: '대전',
    dist: 132,
    unread: 0,
    pinned: false,
    online: false,
  },
  {
    id: 'c3',
    name: '같이노후를살아요',
    last: '네네 확인했습니다',
    time: '어제',
    region: '부산',
    dist: 270,
    unread: 1,
    pinned: false,
    online: true,
  },
  {
    id: 'c4',
    name: '포에버파워',
    last: '헬스 같이 하실래요?',
    time: '2일',
    region: '경기',
    dist: 22,
    unread: 0,
    pinned: false,
    online: false,
  },
];

export default function ChatsScreen({ navigation }) {
  const [active, setActive] = useState('전체');
  const [refreshing, setRefreshing] = useState(false);

  const data = useMemo(() => {
    switch (active) {
      case '읽지 않음':
        return MOCK.filter((m) => m.unread > 0);
      case '신규':
        // 예시: '어제' 또는 '4분' 같이 최근건으로 간주
        return MOCK.filter((m) => ['4분', '1시간', '어제'].includes(m.time));
      case '즐겨찾기':
        return MOCK.filter((m) => m.pinned);
      default:
        return MOCK;
    }
  }, [active]);

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: API 연동 시 리스트 새로고침 호출
    setTimeout(() => setRefreshing(false), 700);
  };

  const openChat = (item) => {
    navigation.navigate('ChatRoom', { id: item.id, name: item.name });
  };

  const renderItem = ({ item }) => (
    <Card style={styles.rowCard}>
      <TouchableOpacity style={styles.rowWrap} activeOpacity={0.85} onPress={() => openChat(item)}>
        {/* 아바타 + 온라인 표시 */}
        <View style={{ marginRight: 12 }}>
          <View>
            <Avatar name={item.name} size="large" />
            {item.online && <View style={styles.onlineDot} />}
          </View>
        </View>

        {/* 본문 */}
        <View style={{ flex: 1 }}>
          <View style={styles.nameLine}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            {!!item.pinned && (
              <Ionicons name="bookmark" size={16} color={colors.primary} style={{ marginLeft: 6 }} />
            )}
          </View>

          <Text style={styles.snippet} numberOfLines={1}>
            {item.last}
          </Text>

          <View style={styles.metaLine}>
            <Badge text={item.time} />
            <Badge icon="location" text={`${item.region} · ${item.dist}km`} />

            {/* 오른쪽: 안읽은 갯수 */}
            <View style={{ marginLeft: 'auto', alignItems: 'flex-end' }}>
              {item.unread > 0 ? (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadTxt}>{item.unread}</Text>
                </View>
              ) : (
                <Text style={styles.readTxt}>읽음</Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 제목 & 검색/새메시지 버튼들 (필요시 더 확장 가능) */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>대화</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="search" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="create" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 알약 필터 (탐색/HOT추천과 동일한 느낌) */}
      <FlatList
        data={FILTERS}
        keyExtractor={(k) => k}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsWrap}
        renderItem={({ item }) => {
          const on = item === active;
          return (
            <TouchableOpacity
              onPress={() => setActive(item)}
              style={[styles.pill, on && styles.pillOn]}
              activeOpacity={0.9}
            >
              <Text style={[styles.pillTxt, on && styles.pillTxtOn]}>{item}</Text>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={
          <TouchableOpacity style={styles.filterGear}>
            <Ionicons name="options" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        }
      />

      {/* 대화 목록 */}
      <FlatList
        data={data}
        keyExtractor={(it) => it.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="chatbubble-ellipses-outline" size={32} color={colors.textTertiary} />
            <Text style={styles.emptyTxt}>대화가 없습니다.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function Badge({ text, icon }) {
  return (
    <View style={styles.badge}>
      {icon && <Ionicons name={icon} size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />}
      <Text style={styles.badgeTxt}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: colors.text },

  // pills
  pillsWrap: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 8, alignItems: 'center' },
  pill: {
    marginRight: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: colors.pillBg || '#F5F6F8',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillOn: { backgroundColor: '#fff', borderColor: colors.pillActiveBorder || colors.primary },
  pillTxt: { color: colors.textSecondary, fontWeight: '700' },
  pillTxtOn: { color: colors.text, fontWeight: '900' },
  filterGear: {
    marginLeft: 6,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
  },

  // row
  rowCard: { padding: 14, borderRadius: 16, backgroundColor: '#fff' },
  rowWrap: { flexDirection: 'row', alignItems: 'center' },

  nameLine: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 17, fontWeight: '800', color: colors.text },
  snippet: { marginTop: 2, color: colors.textSecondary },

  metaLine: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  badgeTxt: { fontSize: 12, color: colors.textSecondary, fontWeight: '700' },

  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadTxt: { color: '#fff', fontWeight: '900', fontSize: 11 },
  readTxt: { color: colors.textTertiary, fontSize: 12, fontWeight: '700' },

  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#fff',
  },

  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  emptyWrap: { alignItems: 'center', gap: 6, marginTop: 40 },
  emptyTxt: { color: colors.textTertiary, fontWeight: '700' },
});
