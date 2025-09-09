// src/screens/main/HomeScreen.js
import React, { useMemo, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import Card from '../../components/Card';

const ICONS = [
  { key: 'HOT추천', label: 'HOT추천', icon: 'flame' },
  { key: '접속중', label: '접속중', icon: 'planet' },
  { key: '가까운', label: '가까운', icon: 'location' },
  { key: '20대', label: '20대', icon: 'sparkles' },
  { key: '30대', label: '30대', icon: 'ribbon' },
  { key: '40대이상', label: '40대이상', icon: 'medal' },
  { key: '이성친구', label: '이성친구', icon: 'people' },
  { key: '즉석만남', label: '즉석만남', icon: 'flash' },
];

export default function HomeScreen({ navigation }) {
  // 30분 타이머(기존 로직 유지)
  const [leftSec, setLeftSec] = useState(30*60);
  useEffect(() => {
    const t = setInterval(()=> setLeftSec(s=> s>0? s-1:0), 1000);
    return ()=> clearInterval(t);
  }, []);
  const leftMinStr = useMemo(()=>{
    const m = Math.floor(leftSec/60), s = leftSec%60;
    return `${m}분 ${String(s).padStart(2,'0')}초`;
  }, [leftSec]);

  const openList = (label) => {
    navigation.navigate('UniversalList', { initialFilter: label });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 앱명 고정 */}
      <View style={styles.topBar}>
        <Text style={styles.appName}>MJ톡</Text>
        <TouchableOpacity style={styles.giftBtn} activeOpacity={0.85}>
          <Text style={styles.giftTxt}>선물 도착!</Text>
          <Ionicons name="gift" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        {/* 초록 배너: 중간 카드 여백 확대 */}
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

        {/* 아이콘 8개 그리드 */}
        <View style={styles.iconGrid}>
          {ICONS.map((it) => (
            <TouchableOpacity key={it.key} style={styles.iconCell} onPress={() => openList(it.key)}>
              <View style={styles.iconCircle}>
                <Ionicons name={it.icon} size={22} color={colors.textSecondary} />
              </View>
              <Text style={styles.iconLabel}>{it.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* (이전 하단 첨부이미지/삭제박스 UI는 제거/주석 처리) */}
        {/* <Card style={{ marginHorizontal: 20, marginTop: 12, height: 220, borderRadius: 20 }}>
          ...
        </Card> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor: colors.background },
  topBar:{
    flexDirection:'row', alignItems:'center',
    paddingHorizontal:16, paddingVertical:12,
    backgroundColor: colors.backgroundSecondary, borderBottomWidth:1, borderBottomColor: colors.border
  },
  appName:{ fontSize:22, fontWeight:'900', color: colors.text },
  giftBtn:{
    marginLeft:'auto', flexDirection:'row', alignItems:'center',
    paddingHorizontal:12, paddingVertical:8, borderRadius:16,
    backgroundColor:'#fff', borderWidth:1, borderColor: colors.border
  },
  giftTxt:{ color: colors.primary, fontWeight:'800', marginRight:6 },

  greenBanner:{ marginHorizontal:16, padding:20, backgroundColor:'#E8FAD8', borderRadius:16, position:'relative', marginTop:14, marginBottom:12 },
  greenLeft:{ gap:6 },
  greenTitle:{ color:'#14853E', fontWeight:'900', fontSize:16 },
  greenDesc:{ color:'#1D4C2B', fontWeight:'700', fontSize:18, lineHeight:26 },
  timerBtn:{
    position:'absolute', right:12, top:14, backgroundColor:'#2FB75E', borderRadius:12,
    paddingHorizontal:10, paddingVertical:8, flexDirection:'row', alignItems:'center', gap:6
  },
  timerTxt:{ color:'#fff', fontWeight:'900' },
  greenBadge:{ position:'absolute', right:12, bottom:10, backgroundColor:'#DDF0CB', borderRadius:12, paddingHorizontal:8, paddingVertical:3 },
  greenBadgeTxt:{ color:'#2D6B39', fontWeight:'700', fontSize:12 },

  iconGrid:{ flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', paddingHorizontal:20, paddingTop:8, paddingBottom:4 },
  iconCell:{ width:'22%', alignItems:'center', marginBottom:16 },
  iconCircle:{
    width:56, height:56, borderRadius:16, backgroundColor:'#fff',
    alignItems:'center', justifyContent:'center', borderWidth:1, borderColor: colors.border, marginBottom:6
  },
  iconLabel:{ fontSize:12, color: colors.textSecondary, fontWeight:'700' },
});
