// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_BASE_URL } from '../config/env'; // 👈 변경: 환경변수에서 가져오기

// 유틸: dob -> ISO(YYYY-MM-DD), gender -> 문자열 정규화
const normalizeDob = (input) => {
  if (input === undefined || input === null || input === '') return undefined;
  // 이미 'YYYY-MM-DD'면 그대로
  if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
  // 날짜로 파싱해서 date-only ISO로
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10); // 'YYYY-MM-DD'
};

const normalizeGender = (input) => {
  if (input === undefined || input === null || input === '') return undefined;
  const str = String(input).trim().toLowerCase();
  // 숫자/문자 케이스 통합
  if (str === '0' || str === 'm' || str === 'male' || str === '남' || str === '남자') return 'male';
  if (str === '1' || str === 'f' || str === 'female' || str === '여' || str === '여자') return 'female';
  if (str === '2' || str === 'other' || str === '기타') return 'other';
  // 그 외는 문자열 그대로 보내되, 빈 값이면 제외
  return str || undefined;
};


const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10초 타임아웃으로 무한대기 방지
});

const AuthContext = createContext({
  user: null,
  token: null,
  initializing: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('auth_token');
      if (storedToken) {
        setToken(storedToken);
        const { data } = await api.get('/users/me', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setUser(data);
      }
    } catch (error) {
      // 토큰이 유효하지 않거나 통신 실패 시 토큰 제거
      await SecureStore.deleteItemAsync('auth_token');
      setToken(null);
      setUser(null);
    } finally {
      setInitializing(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login/email', { email, password });
      const { user: userData, token: authToken } = data;
      await SecureStore.setItemAsync('auth_token', authToken);
      setToken(authToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      Alert.alert('로그인 실패', error.response?.data?.message || '로그인에 실패했습니다.');
      return { success: false };
    }
  };

  const signup = async (signupData) => {
    try {
      const { data } = await api.post('/auth/signup/email', signupData);
      const { user: userData, token: authToken } = data;
      await SecureStore.setItemAsync('auth_token', authToken);
      setToken(authToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      Alert.alert('회원가입 실패', error.response?.data?.message || '회원가입에 실패했습니다.');
      return { success: false };
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      setToken(null);
      setUser(null);
    } catch (error) {
      Alert.alert('오류', '로그아웃 중 문제가 발생했습니다.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, initializing, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
