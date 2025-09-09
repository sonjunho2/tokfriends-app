// src/screens/main/HomeScreen.js
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import Card from '../../components/Card';

const GRID = [
  { key: 'hot', label: 'HOT추천', icon: 'sparkles' },
  { key: 'online', label: '접속중', icon: 'sparkles' },
  { key: 'near', label: '가까운', icon: 'sparkles' },
  { key: 'age20', label: '20대', icon: 'sparkles' },
  { key: 'age30', label: '30대', icon: 'sparkles' },
  { key: 'age40', label: '40대이상', icon: 'sparkles' },
  { key: 'gender', label: '이성친구', icon: 'sparkles' },
  { key: 'quick', label: '즉석만남', icon: 'sparkles' },
];

const THUMB_H = 150;      // 두 카드 동일 높이
const THUMB_W = 120;      // 각 썸네일 폭

// 더미 데이터 (TODO: API로 대체)
const best10 = Array.from({ length: 10 }, (_, i) => ({
  id: 'b' + i,
  img: `https://i.pravatar.cc/300?img=${(i % 60) + 1}`,
}));
const todayNew = Array.from({ length: 12 }, (_, i) => ({
  id: 'n' + i,
  img: `https://picsum.photos/seed/new${i}/300/300`,
}));

export default function HomeScreen({ navigation }) {
  const [leftSec, setLeftSec] = useState(30 * 60);
  useEffect(() => {
    const t = setInterval(() => setLeftSec((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const leftStr = useMemo(() => {
    const m = Math.floor(leftSec / 60);
    const s = String(leftSec % 60).padStart(2, '0');
    return `${m}분 ${s}초`;
  }, [leftSec]);

  // 이미지 셀 공통
  const renderThumb = ({ item }) => (
    <View style={styles.thumbItem}>
      <Image source={{ uri: item.img }} style={styles.thumbImg} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 앱명(가운데/크게) + 검색 */}
      <View style={styles.appbar}>
        {/* 좌측 공간(타이틀 센터 보정) */}
        <View style={{ width: 24 }} />
        <Text style={styles.appTitle}>MJ톡</Text>
        <TouchableOpacity hitSlop={8} style={styles.searchBtn}>
          <Ionicons name="search" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        {/* 초록 배너 */}
        <Card style={styles.greenCard} noPadding>
          <View style={{ padding: 14, paddingRight: 120 }}>
            <Text style={styles.greenTitle}>오직 첫 가입자만!</Text>
            <Text style={styles.greenDesc}>30분 내 프로필 완성 시{'\n'}50포인트 지급</Text>
          </View>
          <TouchableOpacity style={styles.timerBtn} activeOpacity={0.9}>
            <Text style={styles.timerTxt}>{leftStr}</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
          <View style={styles.greenBadge}><Text style={styles.greenBadgeTxt}>1/1</Text></View>
        </Card>

        {/* 2×4 아이콘 그리드 */}
        <View style={styles.grid}>
          {GRID.map((g) => (
            <TouchableOpacity
              key={g.key}
              style={styles.gridItem}
              activeOpacity={0.9}
              onPress={() => { if (g.key === 'hot') navigation.navigate('HotRecommend'); }}
            >
              <View style={styles.gridIcon}>
                <Ionicons name={g.icon} size={22} color={colors.textSecondary} />
              </View>
              <Text style={styles.gridLabel}>{g.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 나에게 관심있는 친구들 */}
        <Card style={styles.wideCard}>
          <View style={styles.wideRow}>
            <Text style={styles.wideTitle}>나에게{'\n'}관심있는 친구들</Text>
            <TouchableOpacity
              onPress={() => {
                // ✅ 탭 전환 + “신규” 세그먼트로
                // (HomeStack 내부에서 상위 탭으로 이동)
                navigation.getParent()?.navigate('Chats', { initialSeg: '신규' });
              }}
            >
              <Text style={styles.link}>확인하기 ›</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 새로운 친구 / 베스트추천 — 동일 높이 + 가로 스크롤 */}
        <View style={styles.dualRow}>
          {/* 새로운 친구 */}
          <View style={styles.dualCol}>
            <View style={styles.dualHeader}>
              <Text style={styles.dualTitle}>새로운 친구</Text>
              <View style={styles.newBadge}><Text style={styles.newBadgeTxt}>NEW</Text></View>
            </View>
            <Card style={[styles.dualCard, { height: THUMB_H }]}>
              <FlatList
                data={todayNew.length > 0 ? todayNew : best10 /* ← 오늘 없으면 어제(대체) */}
                keyExtractor={(it) => it.id}
                horizontal
                renderItem={renderThumb}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 10 }}
              />
            </Card>
          </View>

          {/* 베스트추천 */}
          <View style={styles.dualCol}>
            <Text style={styles.dualTitle}>베스트추천</Text>
            <Card style={[styles.dualCard, { height: THUMB_H }]}>
              <FlatList
                data={best10 /* 베스트 10 */}
                keyExtractor={(it) => it.id}
                horizontal
                renderItem={renderThumb}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 10 }}
              />
            </Card>
          </View>
        </View>

        {/* MJ톡 안내 (자리) */}
        <Card style={styles.guideCard}>
          <Text style={styles.guideTitle}>MJ톡 안내</Text>
          <Text style={styles.guideSub}>공지/도움말/가이드 영역</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  appbar: {
    position: 'relative',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: colors.backgroundSecondary, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  appTitle: { fontSize: 20, fontWeight: '900', color: colors.text, textAlign: 'center', flex: 1 },
  searchBtn: { width: 24, alignItems: 'flex-end' },

  greenCard: { marginHorizontal: 16, marginTop: 12, backgroundColor: '#E8FAD8', borderRadius: 14, position: 'relative' },
  greenTitle: { color: '#14853E', fontWeight: '900', fontSize: 14 },
  greenDesc: { color: '#1D4C2B', fontWeight: '700', fontSize: 16, lineHeight: 22, marginTop: 2 },
  timerBtn: {
    position: 'absolute', right: 10, top: 10,
    backgroundColor: '#2FB75E', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  timerTxt: { color: '#fff', fontWeight: '900', fontSize: 12 },
  greenBadge: { position: 'absolute', right: 10, bottom: 8, backgroundColor: '#DDF0CB', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  greenBadgeTxt: { color: '#2D6B39', fontWeight: '700', fontSize: 11 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 16, paddingTop: 12 },
  gridItem: { width: '22%', alignItems: 'center' },
  gridIcon: {
    width: 56, height: 56, borderRadius: 12,
    backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  gridLabel: { marginTop: 6, fontSize: 12, color: colors.textSecondary, fontWeight: '700' },

  wideCard: { marginHorizontal: 16, marginTop: 12, borderRadius: 14, padding: 16 },
  wideRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  wideTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  link: { color: colors.primary, fontWeight: '800' },

  dualRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginTop: 12 },
  dualCol: { flex: 1 },
  dualHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  dualTitle: { fontSize: 14, fontWeight: '800', color: colors.text },
  newBadge: { marginLeft: 6, backgroundColor: colors.primaryLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  newBadgeTxt: { color: colors.primary, fontWeight: '800', fontSize: 10 },
  dualCard: { borderRadius: 18, justifyContent: 'center' },

  thumbItem: {
    width: THUMB_W, height: THUMB_H - 16,
    marginRight: 10, borderRadius: 16, overflow: 'hidden',
    backgroundColor: '#eee',
  },
  thumbImg: { width: '100%', height: '100%', resizeMode: 'cover' },

  guideCard: { marginHorizontal: 16, marginTop: 12, borderRadius: 14, padding: 16 },
  guideTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  guideSub: { marginTop: 6, color: colors.textSecondary },
});
