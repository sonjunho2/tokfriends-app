// src/screens/auth/NicknameScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import ButtonPrimary from '../../components/ButtonPrimary';
import InputOutlined from '../../components/InputOutlined';

export default function NicknameScreen({ navigation, route }) {
  const [name, setName] = useState('');
  const isValid = name.trim().length >= 2;

  const next = () => {
    navigation.navigate('Gender', { ...route?.params, displayName: name.trim() });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>닉네임을 입력해 주세요</Text>
      <Text style={styles.sub}>2~14자, 공백 제외</Text>

      <View style={styles.form}>
        <InputOutlined
          value={name}
          onChangeText={setName}
          placeholder="예: MJ톡사용자"
          maxLength={14}
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      <View style={styles.bottom}>
        <ButtonPrimary title="다음" onPress={next} disabled={!isValid} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor: colors.background, paddingTop:56, paddingHorizontal:24 },
  title:{ fontSize:26, fontWeight:'800', color: colors.text, textAlign:'center' },
  sub:{ marginTop:8, fontSize:13, color: colors.textSecondary, textAlign:'center' },
  form:{ marginTop:28 },
  input:{ width:'100%' },
  bottom:{ marginTop:'auto', paddingVertical:16 },
});
