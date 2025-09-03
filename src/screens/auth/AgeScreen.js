// src/screens/auth/AgeScreen.js
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import colors from '../../theme/colors';
import ButtonPrimary from '../../components/ButtonPrimary';
import InputOutlined from '../../components/InputOutlined';

export default function AgeScreen({ navigation, route }) {
  const yearNow = useMemo(() => new Date().getFullYear(), []);
  const [year, setYear] = useState('');

  const onChange = (t) => {
    const onlyNum = t.replace(/[^0-9]/g, '').slice(0, 4);
    setYear(onlyNum);
  };

  const next = () => {
    const y = parseInt(year, 10);
    const minYear = yearNow - 80; // 최대 80세
    const maxYear = yearNow - 18; // 최소 18세
    if (!y || y < minYear || y > maxYear) {
      return Alert.alert('안내', `출생연도를 정확히 입력해주세요. (${minYear} ~ ${maxYear})`);
    }
    // 백엔드 dob(YYYY-MM-DD)에 맞춰 변환
    const dob = `${y}-01-01`;
   navigation.navigate('Nickname', {
  email: route.params.email,
  password: route.params.password,
  birthYear: selectedYear,
});


  const disabled = year.length !== 4;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>출생연도를 입력해 주세요</Text>
      <Text style={styles.sub}>만 18세 이상만 가입할 수 있어요</Text>

      <View style={styles.form}>
        <InputOutlined
          value={year}
          onChangeText={onChange}
          placeholder="예: 1995"
          keyboardType="number-pad"
          maxLength={4}
          style={styles.input}
          inputStyle={{ textAlign: 'center', fontSize: 18 }}
        />
      </View>

      <View style={styles.bottom}>
        <ButtonPrimary title="다음" onPress={next} disabled={disabled} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor: colors.background, paddingTop:56, paddingHorizontal:24 },
  title:{ fontSize:26, fontWeight:'800', color: colors.text, textAlign:'center' },
  sub:{ marginTop:8, fontSize:13, color: colors.textSecondary, textAlign:'center' },
  form:{ marginTop:28, alignItems:'center' },
  input:{ width:'100%' },
  bottom:{ marginTop:'auto', paddingVertical:16 },
});
