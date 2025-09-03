import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import ButtonPrimary from '../../components/ButtonPrimary';
import InputOutlined from '../../components/InputOutlined';

export default function NicknameScreen({ navigation }) {
  const [name, setName] = useState('');
  const isValid = name.trim().length >= 2;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MJ톡에서{'\n'}어떤 닉네임을 사용할까요?</Text>

      <InputOutlined
        value={name}
        onChangeText={setName}
        placeholder="닉네임 입력"
        maxLength={14}
        style={{ marginTop: 28 }}
      />

      <View style={styles.bottom}>
        <ButtonPrimary
          title="다음"
          disabled={!isValid}
          onPress={() => navigation.navigate('Gender')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 56, paddingHorizontal: 24 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, textAlign: 'center' },
  bottom: { marginTop: 'auto', paddingVertical: 16 },
});
