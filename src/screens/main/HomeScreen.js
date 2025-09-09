// src/screens/main/HomeScreen.js
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';

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

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 앱명 / 검색 */}
      <View style={styles.appbar}>
        <Text style={styles.appTitle}>MJ톡</Text>
        <TouchableOpacity hitSlop={8}>
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

        {/* 2×4 아이콘 그리드 (라운드 사각 버튼) */}
        <View style={styles.grid}>
          {GRID.map((g) => (
            <TouchableOpacity
              key={g.key}
              style={styles.gridItem}
              activeOpacity={0.9}
              onPress={() => {
                if (g.key === 'hot') navigation.navigate('HotRecommend');
              }}
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
            <TouchableOpacity><Text style={styles.link}>확인하기 ›</Text></TouchableOpacity>
          </View>
        </Card>

        {/* 새로운 친구 / 베스트추천 (자리만) */}
        <View style={styles.dualRow}>
          <View style={styles.dualCol}>
            <View style={styles.dualHeader}>
              <Text style={styles.dualTitle}>새로운 친구</Text>
              <View style={styles.newBadge}><Text style={styles.newBadgeTxt}>NEW</Text></View>
            </View>
            <Card style={styles.dualCard}><Text style={styles.placeholder}>하린</Text></Card>
          </View>
          <View style={styles.dualCol}>
            <Text style={styles.dualTitle}>베스트추천</Text>
            <Card style={styles.dualCard}><Text style={styles.placeholder}>하린</Text></Card>
          </View>
        </View>

        {/* MJ톡 안내 (자리만) */}
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
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: colors.backgroundSecondary, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  appTitle: { fontSize: 16, fontWeight: '800', color: colors.text },

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

  grid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
    paddingHorizontal: 16, paddingTop: 12,
  },
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
  dualCard: { height: 140, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  placeholder: { color: '#E6A6B3', fontSize: 28, fontWeight: '800' },

  guideCard: { marginHorizontal: 16, marginTop: 12, borderRadius: 14, padding: 16 },
  guideTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  guideSub: { marginTop: 6, color: colors.textSecondary },
});
