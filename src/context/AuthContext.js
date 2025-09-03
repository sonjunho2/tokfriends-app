// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient, saveToken, clearToken, getStoredToken } from '../api/client';

const AuthContext = createContext({
  user: null,
  token: null,
  initializing: true,
  // exposed methods
  setUser: (_user, _token) => {},
  login: async (_email, _password) => {},
  signup: async (_data) => {},
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

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      // 1) 헬스체크 (실패해도 앱을 막지 않음)
      try {
        await apiClient.health();
        // console.log('[Auth] Health check passed');
      } catch (e) {
        // console.warn('[Auth] Health check failed:', e?.message || e);
      }

      // 2) 토큰 복구
      const storedToken = await getStoredToken();
      if (storedToken) {
        setState((s) => ({ ...s, token: storedToken }));
        // 3) 유저 조회
        const user = await apiClient.getMe();
        setState((s) => ({ ...s, user }));
      }
    } catch (error) {
      // console.warn('[Auth] Init failed:', error?.message || error);
      if (error?.response?.status === 401) {
        await clearToken();
      }
      setState({ user: null, token: null, initializing: false });
      return;
    }
    setState((s) => ({ ...s, initializing: false }));
  };

  /** ✅ 외부에서 직접 세션을 세팅할 수 있게 제공 (ProfileSetup 등에서 사용) */
  const setUser = async (user, token) => {
    try {
      if (token) {
        await saveToken(token);
      }
    } catch {}
    setState((s) => ({ ...s, user: user || null, token: token || s.token }));
  };

  const login = async (email, password) => {
    try {
      const res = await apiClient.login(email, password);
      const token = res?.access_token;
      if (!token) throw new Error('로그인 응답에 토큰이 없습니다.');

      await saveToken(token);
      setState((s) => ({ ...s, token }));

      const user = await apiClient.getMe();
      setState((s) => ({ ...s, user }));

      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || '로그인에 실패했습니다.';
      return { success: false, error: message };
    }
  };

  const signup = async (data) => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
        displayName: data.displayName,
        gender: data.gender || 'other',
        dob: data.dob || '2000-01-01',
      };

      await apiClient.signup(payload);

      // 가입 직후 자동 로그인
      const loginResult = await login(data.email, data.password);
      if (!loginResult.success) {
        throw new Error(loginResult.error || '자동 로그인 실패');
      }

      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || '회원가입에 실패했습니다.';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await clearToken();
    } catch {}
    setState({ user: null, token: null, initializing: false });
  };

  const refreshMe = async () => {
    if (!state.token) return;
    try {
      const user = await apiClient.getMe();
      setState((s) => ({ ...s, user }));
    } catch (error) {
      if (error?.response?.status === 401) {
        await logout();
      }
    }
  };

  const value = {
    user: state.user,
    token: state.token,
    initializing: state.initializing,
    setUser,     // ✅ 노출
    login,
    signup,
    logout,
    refreshMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
