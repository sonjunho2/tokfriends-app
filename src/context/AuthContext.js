// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import http, { setHttpToken, clearHttpToken } from '../api/http';

const TOKEN_KEY = 'auth_token';

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
  if (['0', 'm', 'male', '남', '남자'].includes(str)) return 'male';
  if (['1', 'f', 'female', '여', '여자'].includes(str)) return 'female';
  if (['2', 'other', '기타'].includes(str)) return 'other';
  return str || undefined;
};

const AuthContext = createContext({
  user: null,
  token: null,
  initializing: true,
  login: async (_email, _password) => ({ ok: false }),
  signup: async (_data) => ({ ok: false }),
  logout: async () => {},
  refreshMe: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    token: null,
    initializing: true,
  });

  // 부팅 시: 토큰 복구 + /users/me 확인
  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(TOKEN_KEY);
        if (stored) {
          setHttpToken(stored);
          setState((s) => ({ ...s, token: stored }));
          const me = await http.get('/users/me');
          setState((s) => ({ ...s, user: me.data }));
        }
      } catch {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        clearHttpToken();
        setState({ user: null, token: null, initializing: false });
        return;
      }
      setState((s) => ({ ...s, initializing: false }));
    })();
  }, []);

  const setTokenAndFetchMe = async (token) => {
    setHttpToken(token);
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    setState((s) => ({ ...s, token }));
    const me = await http.get('/users/me');
    setState((s) => ({ ...s, user: me.data }));
  };

  const login = async (email, password) => {
    try {
      const res = await http.post('/auth/login/email', { email, password });
      const token =
        res.data?.access_token ||
        res.data?.accessToken ||
        res.data?.token ||
        null;
      if (!token) {
        Alert.alert('로그인 실패', '로그인 응답에 토큰이 없습니다.');
        return { ok: false, error: 'no_token' };
      }
      await setTokenAndFetchMe(token);
      return { ok: true };
    } catch (e) {
      const msg = getErrMsg(e);
      console.log('[LOGIN_ERR]', e?.response?.data || e);
      Alert.alert('로그인 실패', msg);
      return { ok: false, error: msg };
    }
  };

  const signup = async (data) => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
        ...(normalizeDob(data.dob) ? { dob: normalizeDob(data.dob) } : {}),
        ...(normalizeGender(data.gender) ? { gender: normalizeGender(data.gender) } : {}),
        ...(data.name ? { name: String(data.name) } : {}),
      };

      await http.post('/auth/signup/email', payload);

      // 성공 시 자동 로그인 (절대 throw 금지)
      const r = await login(data.email, data.password);
      if (!r.ok) {
        // 자동 로그인 실패해도 앱이 죽지 않도록 Alert만
        Alert.alert('자동 로그인 실패', r.error || '다시 로그인해 주세요.');
        return { ok: true, autoLogin: false };
      }
      return { ok: true, autoLogin: true };
    } catch (e) {
      const msg = getErrMsg(e);
      console.log('[SIGNUP_ERR]', e?.response?.data || e);
      Alert.alert('회원가입 실패', msg);
      return { ok: false, error: msg };
    }
  };

  const logout = async () => {
    try { await SecureStore.deleteItemAsync(TOKEN_KEY); } catch {}
    clearHttpToken();
    setState({ user: null, token: null, initializing: false });
  };

  const refreshMe = async () => {
    if (!state.token) return;
    const me = await http.get('/users/me');
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
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
