// src/screens/main/HomeScreen.js
import React, { useMemo, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';

const PILL_ITEMS = ['HOT추천', '내주변', '접속중', '단순대화', '20+', '30+'];
const ICONS = [
  { key: 'hot', label: 'HOT추천', icon: 'flame' },
  { key: 'online', label: '접속중', icon: 'planet' },
  { key: 'near', label: '가까운', icon: 'location' },
  { key: 'age20', label: '20대', icon: 'sparkles' },
  { key: 'age30', label: '30대', icon: 'ribbon' },
  { key: 'gender', label: '이성친구', icon: 'people' },
  { key: 'quick', label: '즉석만남', icon: 'flash' },
  { key: 'counsel', label: '고민상담', icon: 'chatbubble-ellipses' },
];

export default function HomeScreen({ navigation }) {
  const [activePill, setActivePill] = useState(PILL_ITEMS[0]);
  const [leftSec, setLeftSec] = useState(30 * 60); // 30분 타이머

  // 타이머
  useEffect(() => {
    const t = setInterval(() => setLeftSec((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const leftMinStr = useMemo(() => {
    const m = Math.floor(leftSec / 60);
    const s = leftSec % 60;
    return `${m}분 ${String(s).padStart(2, '0')}초`;
  }, [leftSec]);

  const goExplore = () => navigation.navigate('Explore');

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 홈/탐색 토글 */}
      <View style={styles.topTabs}>
        <Text style={[styles.topTab, styles.topTabOn]}>홈</Text>
        <TouchableOpacity onPress={goExplore}>
          <Text style={styles.topTab}>탐색</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.giftBtn} activeOpacity={0.85}>
          <Text style={styles.giftTxt}>선물 도착!</Text>
          <Ionicons name="gift" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        {/* 초록 배너 */}
        <Card style={styles.greenBanner} noPadding>
          <View style={styles.greenLeft}>
            <Text style={styles.greenTitle}>오직 첫 가입자만!</Text>
            <Text style={styles.greenDesc}>30분 내로 프로필 완성하면{'\n'}50포인트를 드려요.</Text>
          </View>
          <TouchableOpacity style={styles.timerBtn} activeOpacity={0.9}>
            <Text style={styles.timerTxt}>{leftMinStr}</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
          <View style={styles.greenBadge}><Text style={styles.greenBadgeTxt}>1/1</Text></View>
        </Card>

        {/* 알약 필터 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsWrap}>
          {PILL_ITEMS.map((p) => {
            const on = p === activePill;
            return (
              <TouchableOpacity key={p} style={[styles.pill, on && styles.pillOn]} onPress={() => setActivePill(p)}>
                <Text style={[styles.pillTxt, on && styles.pillTxtOn]}>{p}</Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity style={styles.filterGear}>
            <Ionicons name="options" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </ScrollView>

        {/* 아이콘 그리드 */}
        <View style={styles.iconGrid}>
          {ICONS.map((it) => (
            <TouchableOpacity
              key={it.key}
              style={styles.iconCell}
              onPress={() => {
                if (it.key === 'hot') navigation.navigate('HotRecommend');
                else if (it.key === 'near') setActivePill('내주변');
                else if (it.key === 'online') setActivePill('접속중');
              }}
            >
              <View style={styles.iconCircle}>
                <Ionicons name={it.icon} size={22} color={colors.textSecondary} />
              </View>
              <Text style={styles.iconLabel}>{it.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 카드: 나에게 관심있는 친구들 */}
        <Card style={styles.bigCard}>
          <View style={styles.bigCardRow}>
            <View>
              <Text style={styles.bigTitle}>나에게{'\n'}관심있는 친구들</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.linkTxt}>확인하기 ›</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 카드: 새로운 친구 */}
        <Card style={styles.bigCard}>
          <View style={styles.bigCardRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Avatar name="새로운 친구" size="small" />
              <Text style={[styles.bigTitle, { marginLeft: 12 }]}>새로운 친구</Text>
              <View style={styles.newBadge}><Text style={styles.newBadgeTxt}>NEW</Text></View>
            </View>
          </View>
        </Card>

        {/* 아래 큰 썸네일 카드(예시) */}
        <Card style={{ marginHorizontal: 20, marginTop: 12, height: 220, borderRadius: 20 }}>
          <View style={styles.thumbBadge}><Text style={styles.thumbBadgeTxt}>인기</Text></View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // 상단 탭/선물
  topTabs: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  topTab: { fontSize: 28, fontWeight: '800', color: colors.textSecondary, marginRight: 14 },
  topTabOn: { color: colors.text, marginRight: 20 },
  giftBtn: {
    marginLeft: 'auto', flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16,
    backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border
  },
  giftTxt: { color: colors.primary, fontWeight: '800', marginRight: 6 },

  // 초록 배너
  greenBanner: { marginHorizontal: 16, padding: 16, backgroundColor: '#E8FAD8', borderRadius: 16, position: 'relative' },
  greenLeft: { gap: 6 },
  greenTitle: { color: '#14853E', fontWeight: '900', fontSize: 16 },
  greenDesc: { color: '#1D4C2B', fontWeight: '700', fontSize: 18, lineHeight: 26 },
  timerBtn: {
    position: 'absolute', right: 12, top: 14,
    backgroundColor: '#2FB75E', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6
  },
  timerTxt: { color: '#fff', fontWeight: '900' },
  greenBadge: { position: 'absolute', right: 12, bottom: 10, backgroundColor: '#DDF0CB', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  greenBadgeTxt: { color: '#2D6B39', fontWeight: '700', fontSize: 12 },

  // 필터 알약
  pillsWrap: { paddingHorizontal: 12, paddingTop: 14, paddingBottom: 8, alignItems: 'center' },
  pill: {
    marginRight: 10, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 22,
    backgroundColor: colors.pillBg || '#F5F6F8', borderWidth: 1, borderColor: colors.border
  },
  pillOn: { backgroundColor: '#fff', borderColor: colors.pillActiveBorder || colors.primary },
  pillTxt: { color: colors.textSecondary, fontWeight: '700' },
  pillTxtOn: { color: colors.text, fontWeight: '900' },
  filterGear: {
    marginLeft: 6, width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
    borderWidth: 1, borderColor: colors.border
  },

  // 아이콘 그리드
  iconGrid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4
  },
  iconCell: { width: '22%', alignItems: 'center', marginBottom: 16 },
  iconCircle: {
    width: 56, height: 56, borderRadius: 18, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border, marginBottom: 6
  },
  iconLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '700' },

  // 큰 카드 2종
  bigCard: { marginHorizontal: 16, marginTop: 12, borderRadius: 16, padding: 16 },
  bigCardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bigTitle: { fontSize: 18, color: colors.text, fontWeight: '800' },
  linkTxt: { color: colors.primary, fontWeight: '800' },
  newBadge: { marginLeft: 8, backgroundColor: colors.primaryLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  newBadgeTxt: { color: colors.primary, fontWeight: '800', fontSize: 10 },

  // 하단 큰 썸네일 예시
  thumbBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: '#111827', opacity: 0.85, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  thumbBadgeTxt: { color: '#fff', fontWeight: '800', fontSize: 10 },
});
