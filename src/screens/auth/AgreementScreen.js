import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import ButtonPrimary from '../../components/ButtonPrimary';

const rows = [
  { key:'privacy', label:'(필수) 개인정보 처리 방침' },
  { key:'tos', label:'(필수) 이용약관' },
  { key:'location', label:'(필수) 위치기반서비스' },
];

export default function AgreementScreen({ navigation }) {
  const [checked, setChecked] = useState({ privacy:false, tos:false, location:false });

  const all = Object.values(checked).every(Boolean);

  const toggleAll = () => {
    const next = !all;
    setChecked({ privacy:next, tos:next, location:next });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>근처톡 이용을 위해{'\n'}약관내용에 동의가 필요해요.</Text>

      <TouchableOpacity style={styles.all} onPress={toggleAll}>
        <Text style={styles.allTxt}>네, 모두 동의합니다</Text>
        <Text style={[styles.check, all && styles.checkOn]}>✓</Text>
      </TouchableOpacity>

      {rows.map(r => (
        <TouchableOpacity key={r.key} style={styles.row} onPress={() => setChecked(s => ({...s, [r.key]:!s[r.key]}))}>
          <Text style={styles.rowTxt}>{r.label}</Text>
          <Text style={[styles.check, checked[r.key] && styles.checkOn]}>✓</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.bottom}>
        <ButtonPrimary title="동의" disabled={!all} onPress={() => navigation.navigate('PhoneAuth')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:colors.background, paddingTop:40, paddingHorizontal:16 },
  title:{ fontSize:26, fontWeight:'800', color:colors.text, textAlign:'center', marginBottom:18 },
  all:{ backgroundColor:'#fff', borderRadius:16, padding:18, borderWidth:2, borderColor:colors.border, flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:14 },
  allTxt:{ fontSize:18, fontWeight:'800' },
  row:{ backgroundColor:'#fff', borderRadius:16, padding:18, borderWidth:2, borderColor:colors.border, flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:12 },
  rowTxt:{ fontSize:16, fontWeight:'700', color:colors.text },
  check:{ width:28, height:28, borderRadius:14, borderWidth:2, borderColor:colors.borderStrong, textAlign:'center', textAlignVertical:'center', color:'transparent' },
  checkOn:{ borderColor:colors.primary, backgroundColor:colors.primaryLight, color:colors.primary, fontWeight:'900' },
  bottom:{ marginTop:'auto', paddingVertical:16 },
});
