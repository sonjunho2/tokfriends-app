// src/screens/auth/AgeScreen.js
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import colors from '../../theme/colors';
import ButtonPrimary from '../../components/ButtonPrimary';

export default function AgeScreen({ navigation, route }) {
  const yearNow = useMemo(() => new Date().getFullYear(), []);
  const [year, setYear] = useState('');

  const onChange = (t) => setYear(t.replace(/[^0-9]/g, '').slice(0, 4));

  const next = () => {
    const y = parseInt(year, 10);
    const minYear = yearNow - 80; // 최대 80세
    const maxYear = yearNow - 18; // 최소 18세
    if (!y || y < minYear || y > maxYear) {
      return Alert.alert('안내', `출생연도를 정확히 입력해주세요. (${minYear} ~ ${maxYear})`);
    }
    // dob: YYYY-01-01 형식(백엔드 dob 필드와 호환)
    const dob = `${y}-01-01`;
    navigation.navigate('Nickname', { ...route?.params, dob });
  };

  const disabled = year.length !== 4;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>출생연도를 입력해 주세요</Text>
      <Text style={styles.sub}>만 18세 이상만 가입할 수 있어요</Text>

      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          value={year}
          onChangeText={onChange}
          keyboardType="number-pad"
          placeholder="예: 1995"
          placeholderTextColor={colors.textTertiary}
          maxLength={4}
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
  inputWrap:{ marginTop:28 },
  input:{
    backgroundColor: colors.backgroundTertiary,
    borderRadius:12, paddingHorizontal:16, paddingVertical:14,
    fontSize:18, color: colors.text, textAlign:'center',
  },
  bottom:{ marginTop:'auto', paddingVertical:16 },
});
