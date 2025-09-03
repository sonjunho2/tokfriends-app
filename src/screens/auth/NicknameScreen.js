// src/screens/auth/NicknameScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import colors from '../../theme/colors';
import ButtonPrimary from '../../components/ButtonPrimary';

export default function NicknameScreen({ navigation, route }) {
  const [name, setName] = useState('');
  const isValid = name.trim().length >= 2;

  const next = () => {
    navigation.navigate('Gender', { ...route?.params, displayName: name.trim() });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>닉네임을 입력해 주세요</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        maxLength={14}
        placeholder="2~14자"
        placeholderTextColor={colors.textTertiary}
      />
      <View style={styles.bottom}>
        <ButtonPrimary title="다음" onPress={next} disabled={!isValid} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor: colors.background, paddingTop:56, paddingHorizontal:24 },
  title:{ fontSize:26, fontWeight:'800', color: colors.text, textAlign:'center' },
  input:{
    marginTop:28,
    backgroundColor: colors.backgroundTertiary,
    borderRadius:12, paddingHorizontal:16, paddingVertical:14,
    fontSize:16, color: colors.text,
  },
  bottom:{ marginTop:'auto', paddingVertical:16 },
});
