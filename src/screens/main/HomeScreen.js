// src/screens/main/HomeScreen.js
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Pressable,
} from 'react-native';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/env';
import colors from '../../theme/colors';

export default function HomeScreen() {
  const { user, token, refreshMe } = useAuth();

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    if (!user?.id || !token) {
      Alert.alert('알림', '로그인 정보(토큰)가 없습니다.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 15000,
      });
      setUserData(res.data);
      // 필요 없으면 Alert 제거 가능
      // Alert.alert('성공', '사용자 정보를 불러왔습니다.');
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        '정보를 불러올 수 없습니다.';
      Alert.alert('오류', String(msg));
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshMe?.();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <ScrollView
        contentContainerStyle={s.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={s.title}>홈</Text>

        <View style={s.card}>
          <Text style={s.label}>현재 로그인 사용자</Text>
          <View style={s.box}>
            <Text style={s.mono}>
              {user ? JSON.stringify(user, null, 2) : '로그인 정보 없음'}
            </Text>
          </View>
        </View>

        <View style={s.actions}>
          <Pressable
            onPress={fetchUserData}
            style={({ pressed }) => [
              s.button,
              { opacity: pressed || loading ? 0.7 : 1 },
            ]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={s.buttonText}>서버에서 내 정보 불러오기</Text>
            )}
          </Pressable>

          <Pressable
            onPress={onRefresh}
            style={({ pressed }) => [
              s.buttonSecondary,
              { opacity: pressed || refreshing ? 0.7 : 1 },
            ]}
            disabled={refreshing}
          >
            {refreshing ? (
              <ActivityIndicator />
            ) : (
              <Text style={s.buttonText}>/users/me 새로고침</Text>
            )}
          </Pressable>
        </View>

        {userData && (
          <View style={s.card}>
            <Text style={s.label}>서버에서 받은 상세 정보</Text>
            <View style={s.box}>
              <Text style={s.mono}>{JSON.stringify(userData, null, 2)}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  label: { color: colors.textSecondary, marginBottom: 8, fontSize: 12 },
  box: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 8,
    padding: 10,
  },
  mono: { fontFamily: 'monospace', color: colors.text, fontSize: 12 },
  actions: { gap: 10, marginTop: 8, marginBottom: 20 },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#111827',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: '700' },
});
