// tokfriends-app/src/screens/Login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { authApi, tokenStore } from '../../lib/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.loginEmail(email, password);
      if (res?.ok && res?.token) {
        tokenStore.set(res.token);
        // App 루트에서 tokenStore 구독으로 자동 전환
      } else {
        setError('로그인 실패');
      }
    } catch (err: any) {
      setError(err?.message || '로그인 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: '#F9FAFB' }}>
      <View style={{ width: 320, backgroundColor: 'white', borderRadius: 16, padding: 16, gap: 12, elevation: 2 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', textAlign: 'center' }}>로그인</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="이메일"
          keyboardType="email-address"
          autoCapitalize="none"
          style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 }}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="비밀번호"
          secureTextEntry
          style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 }}
        />
        {!!error && <Text style={{ color: '#DC2626', fontSize: 12 }}>{error}</Text>}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={{
            backgroundColor: '#2563EB',
            borderRadius: 8,
            paddingVertical: 12,
            alignItems: 'center',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white', fontWeight: '700' }}>로그인</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}
