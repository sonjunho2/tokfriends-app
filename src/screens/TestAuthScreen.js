// src/screens/TestAuthScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert, StyleSheet, ScrollView } from 'react-native';
import { loginWithEmail, signupWithEmail } from '../api/auth';

export default function TestAuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // 회원가입 때만 사용
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const onSignup = async () => {
    if (!email || !password || !name) {
      Alert.alert('입력 필요', '이메일, 비밀번호, 이름을 모두 입력해 주세요.');
      return;
    }
    try {
      setLoading(true);
      const res = await signupWithEmail(email.trim(), password.trim(), name.trim());
      setLastResult(res);
      Alert.alert('회원가입 성공', '이제 같은 정보로 로그인해 보세요.');
    } catch (e) {
      setLastResult(e?.data || e?.message);
      Alert.alert('회원가입 실패', msgFromError(e));
    } finally {
      setLoading(false);
    }
  };

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert('입력 필요', '이메일과 비밀번호를 입력해 주세요.');
      return;
    }
    try {
      setLoading(true);
      const res = await loginWithEmail(email.trim(), password.trim());
      setLastResult(res);
      Alert.alert('로그인 성공', '액세스 토큰이 설정되었습니다.');
    } catch (e) {
      setLastResult(e?.data || e?.message);
      Alert.alert('로그인 실패', msgFromError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={s.wrap}>
      <Text style={s.title}>딱친 API 테스트</Text>

      <Text style={s.label}>이메일</Text>
      <TextInput
        style={s.input}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="example@domain.com"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={s.label}>비밀번호</Text>
      <TextInput
        style={s.input}
        placeholder="비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={s.label}>이름(회원가입 시)</Text>
      <TextInput
        style={s.input}
        placeholder="닉네임 또는 이름"
        value={name}
        onChangeText={setName}
      />

      <View style={s.row}>
        <Pressable style={[s.btn, { backgroundColor: '#111827' }]} onPress={onSignup} disabled={loading}>
          <Text style={s.btnText}>회원가입</Text>
        </Pressable>
        <Pressable style={[s.btn, { backgroundColor: '#2563eb' }]} onPress={onLogin} disabled={loading}>
          <Text style={s.btnText}>로그인</Text>
        </Pressable>
      </View>

      {loading && <ActivityIndicator style={{ marginTop: 16 }} />}

      <Text style={[s.label, { marginTop: 16 }]}>최근 결과</Text>
      <View style={s.resultBox}>
        <Text style={s.resultText}>
          {lastResult ? safeStringify(lastResult) : '아직 없음'}
        </Text>
      </View>

      <Text style={s.help}>
        회원가입은 POST /auth/signup/email, 로그인은 POST /auth/login/email 로 요청합니다.
        로그인 성공 시 액세스 토큰이 전역 HTTP에 자동 설정됩니다.
      </Text>
    </ScrollView>
  );
}

function msgFromError(e) {
  if (e?.data?.message) return Array.isArray(e.data.message) ? e.data.message.join('\n') : String(e.data.message);
  if (typeof e?.message === 'string') return e.message;
  return '요청 실패';
}

function safeStringify(obj) {
  try { return JSON.stringify(obj, null, 2); } catch { return String(obj); }
}

const s = StyleSheet.create({
  wrap: { padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  label: { fontSize: 14, color: '#4b5563', marginTop: 12 },
  input: {
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, backgroundColor: 'white'
  },
  row: { flexDirection: 'row', gap: 12, marginTop: 16 },
  btn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 10 },
  btnText: { color: 'white', fontWeight: '700' },
  resultBox: { marginTop: 8, padding: 12, backgroundColor: '#f3f4f6', borderRadius: 8 },
  resultText: { fontFamily: 'monospace' },
  help: { marginTop: 12, fontSize: 12, color: '#6b7280' },
});
