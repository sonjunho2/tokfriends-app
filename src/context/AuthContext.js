// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { Alert } from 'react-native';
import { API_BASE_URL } from '../config/env';

// ---- 내부 설정 -------------------------------------------------
const TOKEN_KEY = 'auth_token'; // 토큰 저장 키 (앱 전역 통일)
let currentToken = null;        // 인터셉터에서 쓸 메모리 캐시

// axios 인스턴스 (모든 API 공통)
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// 모든 요청에 토큰 자동 첨부
api.interceptors.request.use((config) => {
  if (currentToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${currentToken}`;
  }
  return config;
});

// 에러 메시지 추출
const getErrMsg = (e) => {
  const m = e?.response?.data?.message;
  if (Array.isArray(m)) return m.join('\n');
  return m || e?.message || '요청 실패';
};

// dob → 'YYYY-MM-DD' 로 정규화
const normalizeDob = (input) => {
  if (input === undefined || input === null || input === '') return undefined;
  if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10);
};

// gender → 'male' | 'female' | 'other' 로 정규화(문자열만)
const normalizeGender = (input) => {
  if (input === undefined || input === null || input === '') return undefined;
  const str = String(input).trim().toLowerCase();
  if (['0', 'm', 'male', '남', '남자'].includes(str)) return 'male';
  if (['1', 'f', 'female', '여', '여자'].includes(str)) return 'female';
  if (['2', 'other', '기타'].includes(str)) return 'other';
  return str || undefined;
};

// ---- 컨텍스트 ---------------------------------------------------
const AuthContext = createContext({
  user: null,
  token: null,
  initializing: true,
  login: async (_email, _password) => {},
  signup: async (_data) => {},
  logout: async () => {},
  refreshMe: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// ---- Provider ---------------------------------------------------
export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    token: null,
    initializing: true,
  });

  // 부팅 시 토큰 복구 + me 조회
  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(TOKEN_KEY);
        if (stored) {
          currentToken = stored;
          setState((s) => ({ ...s, token: stored }));
          // ★ 변경: /users/me 대신 토큰에서 userId 추출하여 /users/:id 호출
          const payload = JSON.parse(atob(stored.split('.')[1]));
          const userId = payload.sub;
          const me = await api.get(`/users/${userId}`);
          setState((s) => ({ ...s, user: me.data }));
        }
      } catch (e) {
        // 토큰 무효 시 초기화
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        currentToken = null;
        setState({ user: null, token: null, initializing: false });
        return;
      }
      setState((s) => ({ ...s, initializing: false }));
    })();
  }, []);

  // 공통: 토큰 저장/적용 후 me 조회
  const setTokenAndFetchMe = async (token) => {
    currentToken = token;
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    setState((s) => ({ ...s, token }));
    
    // ★ 변경: 토큰에서 userId 추출
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.sub;
    const me = await api.get(`/users/${userId}`);
    setState((s) => ({ ...s, user: me.data }));
  };

  // 로그인
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login/email', { email, password });
      // ★ 변경: 서버는 token 키로 반환
      const token = res.data?.token;

      if (!token) {
        throw new Error('로그인 응답에 토큰이 없습니다.');
      }
      await setTokenAndFetchMe(token);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: getErrMsg(e) };
    }
  };

  // 회원가입 → 성공 시 자동 로그인
  const signup = async (data) => {
    try {
      // ★ 변경: 서버 스키마에 맞게 필드명 수정
      const payload = {
        email: data.email,
        password: data.password,
        dob: normalizeDob(data.dob) || '2000-01-01', // 필수 필드
        gender: normalizeGender(data.gender) || 'other', // 필수 필드
        ...(data.displayName ? { displayName: String(data.displayName) } : {}),
      };

      await api.post('/auth/signup/email', payload);

      // 자동 로그인
      const r = await login(data.email, data.password);
      if (!r.ok) throw new Error(r.error || '자동 로그인 실패');
      return { ok: true };
    } catch (e) {
      return { ok: false, error: getErrMsg(e) };
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch {}
    currentToken = null;
    setState({ user: null, token: null, initializing: false });
  };

  // 내 정보 새로고침
  const refreshMe = async () => {
    if (!state.token) return;
    
    // ★ 변경: 토큰에서 userId 추출
    const payload = JSON.parse(atob(state.token.split('.')[1]));
    const userId = payload.sub;
    const me = await api.get(`/users/${userId}`);
    setState((s) => ({ ...s, user: me.data }));
  };

  const value = useMemo(
    () => ({
      user: state.user,
      token: state.token,
      initializing: state.initializing,
      login,
      signup,
      logout,
      refreshMe,
    }),
    [state, login, signup]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
