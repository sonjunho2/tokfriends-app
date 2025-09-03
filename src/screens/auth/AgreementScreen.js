// src/screens/auth/AgreementScreen.js
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import colors from '../../theme/colors';
import ButtonPrimary from '../../components/ButtonPrimary';

const TERMS = [
  { key: 'privacy', label: '(필수) 개인정보 처리 방침' },
  { key: 'tos', label: '(필수) 이용약관' },
  { key: 'location', label: '(필수) 위치기반서비스' },
];

export default function AgreementScreen({ navigation, route }) {
  const initialState = useMemo(() => ({ privacy:false, tos:false, location:false }), []);
  const [checked, setChecked] = useState(initialState);
  const all = checked.privacy && checked.tos && checked.location;

  const toggleAll = () => {
    const next = !all;
    setChecked({ privacy: next, tos: next, location: next });
  };
  const toggleOne = (k) => setChecked(s => ({ ...s, [k]: !s[k] }));

  const handleAgree = () => {
    if (!all) return Alert.alert('안내', '필수 항목에 모두 동의해 주세요.');
    // 다음으로 params 그대로 전달
    navigation.navigate('Age', { ...route?.params, agreed: true });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MJ톡 이용을 위해{'\n'}약관 내용에 동의가 필요해요.</Text>

      <TouchableOpacity style={styles.all} onPress={toggleAll} activeOpacity={0.9}>
        <Text style={styles.allTxt}>네, 모두 동의합니다</Text>
        <Text style={[styles.check, all && styles.checkOn]}>✓</Text>
      </TouchableOpacity>

      {TERMS.map(t => {
        const on = !!checked[t.key];
        return (
          <TouchableOpacity key={t.key} style={styles.row} onPress={() => toggleOne(t.key)} activeOpacity={0.9}>
            <Text style={styles.rowTxt}>{t.label}</Text>
            <Text style={[styles.check, on && styles.checkOn]}>✓</Text>
          </TouchableOpacity>
        );
      })}

      <View style={styles.bottom}>
        <ButtonPrimary title="동의" onPress={handleAgree} />
        <Text style={styles.helper}>* 필수 항목에 모두 체크되어야 다음 단계로 이동할 수 있어요.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor: colors.background || '#F7F8FA', paddingTop:40, paddingHorizontal:16 },
  title:{ fontSize:26, fontWeight:'800', color: colors.text || '#111827', textAlign:'center', marginBottom:18 },
  all:{ backgroundColor:'#fff', borderRadius:16, padding:18, borderWidth:2, borderColor: colors.border || '#E4E7EC',
    flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:14 },
  allTxt:{ fontSize:18, fontWeight:'800', color: colors.text || '#111827' },
  row:{ backgroundColor:'#fff', borderRadius:16, padding:18, borderWidth:2, borderColor: colors.border || '#E4E7EC',
    flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:12 },
  rowTxt:{ fontSize:16, fontWeight:'700', color: colors.text || '#111827' },
  check:{ width:28, height:28, borderRadius:14, borderWidth:2, borderColor: colors.border || '#E4E7EC',
    textAlign:'center', textAlignVertical:'center', color:'transparent' },
  checkOn:{ borderColor: colors.primary || '#F36C93', backgroundColor: (colors.primaryLight || '#FFD2DE'),
    color: colors.primary || '#F36C93', fontWeight:'900' },
  bottom:{ marginTop:'auto', paddingVertical:16 },
  helper:{ marginTop:8, fontSize:12, color: colors.textSecondary || '#6B7280', textAlign:'center' },
});
