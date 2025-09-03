import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import colors from '../../theme/colors';
import ButtonPrimary from '../../components/ButtonPrimary';
import InputOutlined from '../../components/InputOutlined';

export default function AgeScreen({ navigation }) {
  const [age, setAge] = useState('');
  const isValid = Number(age) >= 19 && Number(age) <= 80;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>나이가 어떻게 되시나요?</Text>
        <InputOutlined
          value={age}
          onChangeText={(t) => setAge(t.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
          maxLength={2}
          style={{ width:220, alignSelf:'center', marginTop:24 }}
        />
      </View>
      <View style={styles.bottom}>
        <ButtonPrimary title="다음" onPress={() => navigation.navigate('Nickname')} disabled={!isValid} />
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor: colors.background },
  content:{ flex:1, paddingTop:56, paddingHorizontal:24 },
  title:{ fontSize:28, fontWeight:'800', color: colors.text, textAlign:'center' },
  bottom:{ padding:16, backgroundColor:'#fff' },
});
