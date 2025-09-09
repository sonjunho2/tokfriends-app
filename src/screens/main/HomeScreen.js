// src/screens/main/HomeScreen.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';
import SegmentBar, { DEFAULT_SEGMENTS } from '../../components/SegmentBar';

const HOME_MENU = [
  'HOT추천',
  '접속중',
  '가까운',
  '20대',
  '30대',
  '40대이상',
  '이성친구',
  '즉석만남',
];

export default function HomeScreen({ navigation, route }) {
  // 홈 상단 메뉴(아이콘 그리드)와 동일한 카테고리
  const [activeMenu, setActiveMenu] = useState(HOME_MENU[0]);

  // 30분 카운트다운
  const [leftSec, setLeftSec] = useState(30 * 60);
  useEffect(() => {
    const t = setInterval(() => setLeftSec((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const leftLabel = useMemo(() => {
    const m = Math.floor(leftSec / 60);
    const s = leftSec % 60;
    return `${m}분 ${String(s).padStart(2, '0')}초`;
  }, [leftSec]);

  // 더미 데이터 (나에게 관심 있는 친구들 / 새로운 친구 / 베스트추천)
  const interestUsers = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: `interest-${i + 1}`,
        name: ['수아', '윤희', '민지', '지민', '나린', '다연', '보라', '해린'][i % 8],
        age: [26, 31, 24, 29, 34, 21, 27, 32][i % 8],
        points: [0, 50, 5, 0, 10, 0, 0, 90][i % 8],
        avatar: `https://i.pravatar.cc/150?img=${(i % 60) + 1}`,
      })),
    []
  );

  const newJoinUsers = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: `new-${i + 1}`,
        name: ['여니', '코코', '라임', '쑤', '솜'][i % 5],
        age: [22, 23, 21, 24, 20][i % 5],
        avatar: `https://i.pravatar.cc/150?img=${(i % 60) + 1}`,
      })),
    []
  );

  const bestUsers = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: `best-${i + 1}`,
        name: ['하린', '지우', '시윤', '유리', '다정'][i % 5],
        age: [28, 25, 30, 26, 27][i % 5],
        avatar: `https://i.pravatar.cc/150?img=${(i % 60) + 1}`,
      })),
    []
  );

  // 베스트추천 간단 회전 인덱스
  const [bestIndex, setBestIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setBestIndex((i) => (i + 1) % bestUsers.length);
    }, 2500);
    return () => clearInterval(t);
  }, [bestUsers.length]);

  // 공용 리스트 화면으로 이동 (탐색)
  const goExplore = (category) => {
    navigation.navigate('Explore', {
      selected: category || activeMenu,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단: 앱명 중앙 정렬 */}
      <View style={styles.header}>
        <View style={{ width: 26 }} />
        <Text style={styles.headerTitle}>MJ톡</Text>
        <TouchableOpacity onPress={() => goExplore()}>
          <Ionicons name="search" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        {/* 상단 초록 프로모션 카드 (상단삭제 → 앱명, 하단 알약바 삭제됨 → 이 카드 높이를 조금 키움) */}
        <Card style={styles.greenBanner} noPadding>
          <View style={styles.greenLeft}>
            <Text style={styles.greenTitle}>오직 첫 가입자만!</Text>
            <Text style={styles.greenDesc}>30분 내 프로필 완성 시{'\n'}50포인트 지급</Text>
          </View>
          <View style={styles.timerBtn}>
            <Text style={styles.timerTxt}>{leftLabel}</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </View>
          <View style={styles.greenBadge}><Text style={styles.greenBadgeTxt}>1/1</Text></View>
        </Card>

        {/* (하단) 알약바는 홈에서는 제거 → 공용 리스트 화면에서만 표시 */}

        {/* 아이콘 그리드: 홈 메뉴(8개) */}
        <View style={styles.iconGrid}>
          {HOME_MENU.map((label) => (
            <TouchableOpacity
              key={label}
              style={styles.iconCell}
              onPress={() => {
                setActiveMenu(label);
                if (label === 'HOT추천') navigation.navigate('HotRecommend');
                else goExplore(label);
              }}
            >
              <View style={styles.iconSquare}>
                <Ionicons name="sparkles" size={20} color={colors.textSecondary} />
              </View>
              <Text style={styles.iconLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 카드: 나에게 관심있는 친구들 (확인하기 → 내대화 신규/필터로 이동) */}
        <Card style={styles.bigCard}>
          <View style={styles.bigCardRow}>
            <View>
              <Text style={styles.bigTitle}>나에게{'\n'}관심있는 친구들</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Chats', { filter: '신규' })}>
              <Text style={styles.linkTxt}>확인하기 ›</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={interestUsers}
            keyExtractor={(it) => it.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 10 }}
            renderItem={({ item }) => (
              <View style={styles.smallUser}>
                <Avatar
                  name={item.name}
                  size={64}
                  showBorder
                  // 사각 라운드 (디자인 일관)
                  style={{ borderRadius: 14, overflow: 'hidden' }}
                />
                <Text style={styles.smallUserName} numberOfLines={1}>
                  {item.name}, {item.age}
                </Text>
              </View>
            )}
          />
        </Card>

        {/* 카드: 새로운 친구 (오늘 없으면 어제 마지막 고정 느낌으로 노출) */}
        <Card style={styles.bigCard}>
          <View style={styles.bigCardRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.bigTitle}>새로운 친구</Text>
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeTxt}>NEW</Text>
              </View>
            </View>
          </View>
          <FlatList
            data={newJoinUsers}
            keyExtractor={(it) => it.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 10 }}
            renderItem={({ item }) => (
              <View style={styles.smallUser}>
                <Avatar
                  name={item.name}
                  size={64}
                  style={{ borderRadius: 14, overflow: 'hidden' }}
                />
                <Text style={styles.smallUserName} numberOfLines={1}>
                  {item.name}, {item.age}
                </Text>
              </View>
            )}
          />
        </Card>

        {/* 카드: 베스트추천 (10명 이미지 자동 회전) */}
        <Card style={styles.bigCard}>
          <View style={styles.bigCardRow}>
            <Text style={styles.bigTitle}>베스트추천</Text>
            <TouchableOpacity onPress={() => goExplore('HOT추천')}>
              <Text style={styles.linkTxt}>더보기 ›</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bestBox}>
            <Avatar
              name={bestUsers[bestIndex]?.name}
              size={96}
              style={{ borderRadius: 20, overflow: 'hidden' }}
            />
            <Text style={{ marginTop: 8, fontWeight: '700', color: colors.text }}>
              {bestUsers[bestIndex]?.name}, {bestUsers[bestIndex]?.age}
            </Text>
          </View>
        </Card>

        {/* (맨 아래) 복구된 하단 박스 (Placeholder) */}
        <Card style={styles.bottomRestored}>
          <Text style={{ fontWeight: '800', color: colors.text }}>MJ톡 안내</Text>
          <Text style={{ marginTop: 6, color: colors.textSecondary }}>
            안전하고 즐거운 커뮤니티를 위해 운영정책을 확인해 주세요.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: colors.text },

  greenBanner: {
    marginHorizontal: 16, marginTop: 12, padding: 18, backgroundColor: '#E8FAD8',
    borderRadius: 16, position: 'relative', minHeight: 110,
  },
  greenLeft: { gap: 6, paddingRight: 120 },
  greenTitle: { color: '#14853E', fontWeight: '900', fontSize: 16 },
  greenDesc: { color: '#1D4C2B', fontWeight: '700', fontSize: 18, lineHeight: 26 },
  timerBtn: {
    position: 'absolute', right: 12, top: 14,
    backgroundColor: '#2FB75E', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  timerTxt: { color: '#fff', fontWeight: '900' },
  greenBadge: { position: 'absolute', right: 12, bottom: 10, backgroundColor: '#DDF0CB', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  greenBadgeTxt: { color: '#2D6B39', fontWeight: '700', fontSize: 12 },

  iconGrid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4,
  },
  iconCell: { width: '22%', alignItems: 'center', marginBottom: 16 },
  iconSquare: {
    width: 56, height: 56, borderRadius: 14, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border, marginBottom: 6,
  },
  iconLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '700' },

  bigCard: { marginHorizontal: 16, marginTop: 12, borderRadius: 16, padding: 16 },
  bigCardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bigTitle: { fontSize: 18, color: colors.text, fontWeight: '800' },
  linkTxt: { color: colors.primary, fontWeight: '800' },

  smallUser: { width: 76, marginRight: 12, alignItems: 'center' },
  smallUserName: { marginTop: 6, fontSize: 12, color: colors.text, fontWeight: '700' },

  newBadge: { marginLeft: 8, backgroundColor: colors.primaryLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  newBadgeTxt: { color: colors.primary, fontWeight: '800', fontSize: 10 },

  bestBox: { marginTop: 12, alignItems: 'center' },

  bottomRestored: { marginHorizontal: 16, marginTop: 12, borderRadius: 16, padding: 16 },
});
