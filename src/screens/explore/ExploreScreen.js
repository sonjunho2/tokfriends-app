// src/screens/explore/ExploreScreen.js
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import UserListItem from '../../components/UserListItem';

const TABS = ['인기','내주변','접속중'];

export default function ExploreScreen({ navigation, route }) {
  const initial = Number(route?.params?.tabIndex ?? 2); // 기본 '접속중'
  const [tab, setTab] = useState(initial);

  // TODO: 실제 API로 교체
  const data = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i+1,
      name: ['시아찡','식연','같이노후를살아요','한수아리장미','포에버파워'][i%5],
      age: [41,42,55,39,53][i%5],
      points: [35,30,25,30,50][i%5],
      subtitle: '마음이 맞으면 만나고 싶어요 혼자서 자취해요',
      avatar: `https://i.pravatar.cc/150?img=${(i%60)+1}`,
      lastSeenLabel: ['26초','26초','29초','36초','41초'][i%5],
      regionLabel: ['경기','경상','서울','제주','부산'][i%5],
      distanceKm: [260,171,270,136,177][i%5],
    })), [tab]
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topDim}>홈</Text>
        <Text style={styles.topOn}>탐색</Text>
        <TouchableOpacity style={styles.giftBtn} activeOpacity={0.8}>
          <Text style={styles.giftTxt}>선물 도착!</Text>
          <Ionicons name="gift" size={16} color="#D33" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        <View style={styles.tabs}>
          {TABS.map((t, i) => {
            const on = i === tab;
            return (
              <TouchableOpacity key={t} style={[styles.tab, on && styles.tabOn]} onPress={() => setTab(i)}>
                <Text style={[styles.tabTxt, on && styles.tabTxtOn]}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity style={styles.setting} activeOpacity={0.8}>
          <Ionicons name="options" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(it) => String(it.id)}
        renderItem={({ item }) => <UserListItem item={item} onPress={() => {}} />}
        contentContainerStyle={{ paddingHorizontal:16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:colors.background },
  topBar:{ flexDirection:'row', alignItems:'center', gap:14, paddingHorizontal:16, paddingVertical:12, backgroundColor:colors.backgroundSecondary, borderBottomWidth:1, borderBottomColor:colors.border },
  topDim:{ fontSize:24, fontWeight:'800', color:colors.textTertiary },
  topOn:{ fontSize:24, fontWeight:'900', color:colors.text },
  giftBtn:{ marginLeft:'auto', flexDirection:'row', alignItems:'center', gap:6, paddingHorizontal:12, paddingVertical:8, borderRadius:18, backgroundColor:'#FFECEB' },
  giftTxt:{ color:'#D33', fontWeight:'800' },
  filterRow:{ flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingVertical:14, gap:12 },
  tabs:{ flexDirection:'row', flex:1, gap:10 },
  tab:{ paddingHorizontal:16, paddingVertical:10, borderRadius:18, backgroundColor:colors.pillBg, borderWidth:1, borderColor:colors.border },
  tabOn:{ backgroundColor:colors.pillActiveBg, borderColor:colors.pillActiveBorder },
  tabTxt:{ color:colors.textSecondary, fontWeight:'700' },
  tabTxtOn:{ color:colors.primary },
  setting:{ width:38, height:38, borderRadius:12, alignItems:'center', justifyContent:'center', backgroundColor:colors.backgroundSecondary, borderWidth:1, borderColor:colors.border },
});
