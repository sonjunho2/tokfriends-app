// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { Alert } from 'react-native';
import { API_BASE_URL } from '../config/env';

// ---- 내부 설정 -------------------------------------------------
const TOKEN_KEY = 'auth_token';   // 토큰 저장 키
const USER_KEY  = 'auth_user';    // 로그인/회원가입 응답 user 저장 키
let currentToken = null;          // 인터셉터에서 쓸 메모리 캐시

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

  // 부팅 시 토큰/유저 복구 (+선택적 새로고침)
  useEffect(() => {
    (async () => {
      try {
        const [storedToken, storedUserJson] = await Promise.all([
          SecureStore.getItemAsync(TOKEN_KEY),
          SecureStore.getItemAsync(USER_KEY),
        ]);

        if (storedToken) {
          currentToken = storedToken;
        }

        if (storedToken && storedUserJson) {
          const storedUser = JSON.parse(storedUserJson);
          setState({ user: storedUser, token: storedToken, initializing: false });

          // 선택: 서버 최신 상태로 새로고침 (백엔드 라우트: GET /users/:id)
          if (storedUser?.id) {
            try {
              const me = await api.get(`/users/${storedUser.id}`);
              if (me?.data) {
                setState((s) => ({ ...s, user: me.data }));
                await SecureStore.setItemAsync(USER_KEY, JSON.stringify(me.data));
              }
            } catch {
              // 새로고침 실패해도 복구 상태는 유지
            }
          }
          return;
        }

        // 복구 불가 → 로그인 필요
        setState({ user: null, token: null, initializing: false });
      } catch {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_KEY);
        currentToken = null;
        setState({ user: null, token: null, initializing: false });
      }
    })();
  }, []);

  // 로그인/회원가입 성공 후 공통 저장
  const saveAuth = async ({ token, user }) => {
    currentToken = token || null;
    if (token) await SecureStore.setItemAsync(TOKEN_KEY, token);
    if (user)  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    setState({ user: user || null, token: token || null, initializing: false });
  };

  // 로그인
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login/email', { email, password });

      // 다양한 키명 대응
      const token =
        res.data?.token ||
        res.data?.accessToken ||
        res.data?.access_token ||
        null;

      const user =
        res.data?.user ||
        res.data?.profile ||
        null;

      if (!token) throw new Error('로그인 응답에 토큰이 없습니다.');
      await saveAuth({ token, user });

      return { ok: true };
    } catch (e) {
      Alert.alert('로그인 실패', getErrMsg(e));
      return { ok: false, error: getErrMsg(e) };
    }
  };

  // 회원가입 → 성공 시 자동 로그인
  const signup = async (data) => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
        ...(normalizeDob(data.dob) ? { dob: normalizeDob(data.dob) } : {}),
        ...(normalizeGender(data.gender) ? { gender: normalizeGender(data.gender) } : {}),
        ...(data.name ? { name: String(data.name) } : {}),
      };

      const res = await api.post('/auth/signup/email', payload);

      // 서버가 가입과 동시에 토큰/유저를 주면 저장
      const token =
        res.data?.token ||
        res.data?.accessToken ||
        res.data?.access_token ||
        null;

      const user =
        res.data?.user ||
        res.data?.profile ||
        null;

      if (token && user) {
        await saveAuth({ token, user });
        return { ok: true };
      }

      // 아니면 로그인 한 번 더
      const r = await login(data.email, data.password);
      if (!r.ok) throw new Error(r.error || '자동 로그인 실패');
      return { ok: true };
    } catch (e) {
      Alert.alert('회원가입 실패', getErrMsg(e));
      return { ok: false, error: getErrMsg(e) };
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch {}
    currentToken = null;
    setState({ user: null, token: null, initializing: false });
  };

  // 내 정보 새로고침 (GET /users/:id 사용)
  const refreshMe = async () => {
    try {
      const id = state?.user?.id;
      if (!id) return;
      const me = await api.get(`/users/${id}`);
      if (me?.data) {
        setState((s) => ({ ...s, user: me.data }));
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(me.data));
      }
    } catch (e) {
      // 새로고침 실패는 무시
    }
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
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
