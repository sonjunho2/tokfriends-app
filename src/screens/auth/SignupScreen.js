import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import Card from '../../components/Card';
import ButtonPrimary from '../../components/ButtonPrimary';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);

  // 정책: 비밀번호 최소 8자
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const pwValid = pw.length >= 8;
  const match = pw === pw2;
  const canNext = emailValid && pwValid && match && !loading;

  const next = () => {
    if (!emailValid) return Alert.alert('안내', '올바른 이메일을 입력해 주세요.');
    if (!pwValid) return Alert.alert('안내', '비밀번호는 8자 이상이어야 합니다.');
    if (!match) return Alert.alert('안내', '비밀번호 확인이 일치하지 않습니다.');
    setLoading(true);
    try {
      navigation.navigate('Agreement', { email: email.trim(), password: pw });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>계정을 만들어 볼까요?</Text>
      <Card style={styles.form}>
        <View style={styles.inputWrap}>
          <Text style={styles.label}>이메일</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
            <Ionicons name="mail-outline" size={20} color={colors.textTertiary} style={styles.icon} />
          </View>
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.label}>비밀번호</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="8자 이상"
              placeholderTextColor={colors.textTertiary}
              secureTextEntry={!showPw}
              autoCapitalize="none"
              value={pw}
              onChangeText={setPw}
              editable={!loading}
            />
            <TouchableOpacity style={styles.icon} onPress={() => setShowPw(!showPw)}>
              <Ionicons name={showPw ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.label}>비밀번호 확인</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="다시 입력"
              placeholderTextColor={colors.textTertiary}
              secureTextEntry={!showPw2}
              autoCapitalize="none"
              value={pw2}
              onChangeText={setPw2}
              editable={!loading}
            />
            <TouchableOpacity style={styles.icon} onPress={() => setShowPw2(!showPw2)}>
              <Ionicons name={showPw2 ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        <ButtonPrimary title="다음" onPress={next} disabled={!canNext} style={{ marginTop: 8 }} />
      </Card>

      <TouchableOpacity onPress={() => navigation.replace('Login')} style={{ marginTop: 12 }}>
        <Text style={{ color: colors.primary, fontWeight: '700' }}>이미 계정이 있으신가요? 로그인</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor: colors.background, paddingTop:40, paddingHorizontal:24 },
  title:{ fontSize:28, fontWeight:'800', color: colors.text, textAlign:'center', marginBottom:16 },
  form:{ padding:24 },
  inputWrap:{ marginBottom:18 },
  label:{ fontSize:14, fontWeight:'700', color: colors.text, marginBottom:8 },
  inputRow:{ position:'relative' },
  input:{
    backgroundColor: colors.backgroundTertiary,
    borderRadius:12, paddingHorizontal:16, paddingVertical:14, paddingRight:44,
    fontSize:16, color: colors.text,
  },
  icon:{ position:'absolute', right:16, top:'50%', marginTop:-10 },
});
