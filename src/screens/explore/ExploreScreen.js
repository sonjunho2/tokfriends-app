// src/screens/explore/ExploreScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';

const FILTERS = ['인기', '내주변', '접속중'];

const MOCK = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: ['시아찡', '식연', '같이노후를살아요', '한수아리장미', '포에버파워'][i % 5],
  age: [41, 42, 55, 39, 53][i % 5],
  status: ['26초', '29초', '36초', '41초'][i % 4],
  region: ['서울', '경기', '부산', '제주'][i % 4],
  dist: [136, 170, 233, 270][i % 4],
}));

export default function ExploreScreen({ navigation }) {
  const [active, setActive] = useState('접속중');

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 홈/탐색 토글 (탐색 활성) */}
      <View style={styles.topTabs}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.topTab}>홈</Text>
        </TouchableOpacity>
        <Text style={[styles.topTab, styles.topTabOn]}>탐색</Text>

        <TouchableOpacity style={styles.giftBtn} activeOpacity={0.85}>
          <Text style={styles.giftTxt}>선물 도착!</Text>
          <Ionicons name="gift" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* 필터 알약 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsWrap}>
        {FILTERS.map((p) => {
          const on = p === active;
          return (
            <TouchableOpacity key={p} style={[styles.pill, on && styles.pillOn]} onPress={() => setActive(p)}>
              <Text style={[styles.pillTxt, on && styles.pillTxtOn]}>{p}</Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity style={styles.filterGear}>
          <Ionicons name="options" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </ScrollView>

      <FlatList
        data={MOCK}
        keyExtractor={(it) => String(it.id)}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Card style={styles.rowCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Avatar name={item.name} size="large" />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.rowName}>{item.name}, {item.age}</Text>
                  <Text style={styles.pPoint}> 35P</Text>
                </View>
                <Text style={styles.rowSub} numberOfLines={1}>마음이 맞으면 만나고 싶어요 혼자서 자취해요</Text>
                <View style={{ flexDirection: 'row', marginTop: 6 }}>
                  <Badge text={item.status} />
                  <Badge icon="location" text={`${item.region} · ${item.dist}km`} />
                </View>
              </View>
            </View>
          </Card>
        )}
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
  topTabs: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  topTab: { fontSize: 28, fontWeight: '800', color: colors.textSecondary, marginRight: 14 },
  topTabOn: { color: colors.text, marginRight: 20 },
  giftBtn: {
    marginLeft: 'auto', flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16,
    backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border
  },
  giftTxt: { color: colors.primary, fontWeight: '800', marginRight: 6 },

  pillsWrap: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 8, alignItems: 'center' },
  pill: { marginRight: 10, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 22, backgroundColor: colors.pillBg, borderWidth: 1, borderColor: colors.border },
  pillOn: { backgroundColor: '#fff', borderColor: colors.pillActiveBorder || colors.primary },
  pillTxt: { color: colors.textSecondary, fontWeight: '700' },
  pillTxtOn: { color: colors.text, fontWeight: '900' },
  filterGear: { marginLeft: 6, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border },

  rowCard: { padding: 14, borderRadius: 16 },
  rowName: { fontSize: 18, fontWeight: '800', color: colors.text },
  pPoint: { color: colors.primary, fontWeight: '800' },
  rowSub: { marginTop: 2, color: colors.textSecondary },
  badge: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, marginRight: 8, backgroundColor: '#fff' },
  badgeTxt: { fontSize: 12, color: colors.textSecondary, fontWeight: '700' },
});
