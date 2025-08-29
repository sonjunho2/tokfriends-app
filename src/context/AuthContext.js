import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { apiClient, saveToken, clearToken, getStoredToken } from '../api/client';

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

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    token: null,
    initializing: true,
  });

  // 부팅 시 토큰 복구 + 헬스체크 + me 조회
  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      // 1. 헬스체크
      await apiClient.health();
      console.log('[Auth] Health check passed');

      // 2. 토큰 복구
      const storedToken = await getStoredToken();
      if (storedToken) {
        setState((s) => ({ ...s, token: storedToken }));
        
        // 3. 내 정보 조회
        const user = await apiClient.getMe();
        setState((s) => ({ ...s, user }));
        console.log('[Auth] Auto login successful');
      }
    } catch (error) {
      console.log('[Auth] Init failed:', error.message);
      // 토큰이 무효하면 삭제
      if (error.response?.status === 401) {
        await clearToken();
      }
      setState({ user: null, token: null, initializing: false });
      return;
    }
    
    setState((s) => ({ ...s, initializing: false }));
  };

  const login = async (email, password) => {
    try {
      const response = await apiClient.login(email, password);
      const token = response.access_token;

      if (!token) {
        throw new Error('로그인 응답에 토큰이 없습니다.');
      }

      await saveToken(token);
      setState((s) => ({ ...s, token }));

      // 내 정보 조회
      const user = await apiClient.getMe();
      setState((s) => ({ ...s, user }));

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message || '로그인에 실패했습니다.';
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

      // 자동 로그인
      const loginResult = await login(data.email, data.password);
      if (!loginResult.success) {
        throw new Error(loginResult.error || '자동 로그인 실패');
      }

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message || '회원가입에 실패했습니다.';
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
      console.error('Failed to refresh user:', error);
      if (error.response?.status === 401) {
        await logout();
      }
    }
  };

  const value = {
    user: state.user,
    token: state.token,
    initializing: state.initializing,
    login,
    signup,
    logout,
    refreshMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
