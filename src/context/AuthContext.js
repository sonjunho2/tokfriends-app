// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { api } from '../lib/api';        // ✅ 공용 axios
import { API_BASE_URL } from '../config/env';

const TOKEN_KEY = 'auth_token';
let currentToken = null;

api.interceptors.request.use((config) => {
  // 토큰 자동 첨부
  if (currentToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${currentToken}`;
  }
  return config;
});

const getErrMsg = (e) => {
  const m = e?.response?.data?.message;
  if (Array.isArray(m)) return m.join('\n');
  return m || e?.message || '요청 실패';
};

const normalizeDob = (input) => {
  if (input === undefined || input === null || input === '') return undefined;
  if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10);
};

const normalizeGender = (input) => {
  if (input === undefined || input === null || input === '') return undefined;
  const str = String(input).trim().toLowerCase();
  if (['0','m','male','남','남자'].includes(str)) return 'male';
  if (['1','f','female','여','여자'].includes(str)) return 'female';
  if (['2','other','기타'].includes(str)) return 'other';
  return str || undefined;
};

const AuthContext = createContext({
  user: null,
  token: null,
  initializing: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  refreshMe: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({ user: null, token: null, initializing: true });

  useEffect(() => {
    (async () => {
      console.log('[BOOT] API_BASE_URL =', API_BASE_URL);
      try {
        const stored = await SecureStore.getItemAsync(TOKEN_KEY);
        if (stored) {
          currentToken = stored;
          setState((s) => ({ ...s, token: stored }));
          const me = await api.get('/users/me');
          setState((s) => ({ ...s, user: me.data }));
        }
      } catch (e) {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        currentToken = null;
        setState({ user: null, token: null, initializing: false });
        return;
      }
      setState((s) => ({ ...s, initializing: false }));
    })();
  }, []);

  const setTokenAndFetchMe = async (token) => {
    currentToken = token;
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    setState((s) => ({ ...s, token }));
    const me = await api.get('/users/me');
    setState((s) => ({ ...s, user: me.data }));
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login/email', { email, password });
      const token = res.data?.access_token || res.data?.accessToken || res.data?.token || null;
      if (!token) throw new Error('로그인 응답에 토큰이 없습니다.');
      await setTokenAndFetchMe(token);
      return { ok: true };
    } catch (e) {
      Alert.alert('로그인 실패', getErrMsg(e));
      return { ok: false, error: getErrMsg(e) };
    }
  };

  const signup = async (data) => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
        ...(data.name ? { name: String(data.name) } : {}),
        ...(normalizeDob(data.dob) ? { dob: normalizeDob(data.dob) } : {}),
        ...(normalizeGender(data.gender) ? { gender: normalizeGender(data.gender) } : {}),
        ...(data.displayName ? { displayName: String(data.displayName) } : {}),
      };
      await api.post('/auth/signup/email', payload);
      const r = await login(data.email, data.password);
      if (!r.ok) throw new Error(r.error || '자동 로그인 실패');
      return { ok: true };
    } catch (e) {
      Alert.alert('회원가입 실패', getErrMsg(e));
      return { ok: false, error: getErrMsg(e) };
    }
  };

  const logout = async () => {
    try { await SecureStore.deleteItemAsync(TOKEN_KEY); } catch {}
    currentToken = null;
    setState({ user: null, token: null, initializing: false });
  };

  const refreshMe = async () => {
    if (!state.token) return;
    const me = await api.get('/users/me');
    setState((s) => ({ ...s, user: me.data }));
  };

  const value = useMemo(() => ({
    user: state.user,
    token: state.token,
    initializing: state.initializing,
    login, signup, logout, refreshMe,
  }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
