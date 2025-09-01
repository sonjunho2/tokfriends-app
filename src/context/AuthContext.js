// src/context/AuthContext.js - 수정된 버전
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  apiClient,
  saveToken,
  clearToken,
  getStoredToken,
  setAuthToken,
} from '../api/client';

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
      // 1. 헬스체크 (선택사항 - 실패해도 계속 진행)
      try {
        await apiClient.health();
        console.log('[Auth] Health check passed');
      } catch (healthError) {
        console.log('[Auth] Health check failed, continuing anyway:', healthError.message);
      }

      // 2. 토큰 복구
      const storedToken = await getStoredToken();
      if (storedToken) {
        setState((s) => ({ ...s, token: storedToken }));
        
        // 3. 내 정보 조회 - /users/me의 실제 응답 형식에 맞춰 처리
        try {
          const response = await apiClient.getMe();
          // 백엔드가 { ok: true, data: { ... } } 형식으로 응답한다면
          const user = response.ok ? response.data : response;
          setState((s) => ({ ...s, user }));
          console.log('[Auth] Auto login successful');
        } catch (meError) {
          console.log('[Auth] Failed to get user info:', meError.message);
          // 사용자 정보 조회 실패 시 토큰 삭제
          await clearToken();
          setState((s) => ({ ...s, token: null }));
        }
      }
    } catch (error) {
      console.log('[Auth] Init failed:', error.message);
      setState({ user: null, token: null, initializing: false });
      return;
    }
    
    setState((s) => ({ ...s, initializing: false }));
  };

  const login = async (email, password) => {
    try {
      const response = await apiClient.login(email, password);
      
      // 백엔드 응답에서 토큰 추출 (여러 형식 대응)
      const token = response.token || response.access_token;
      if (!token) {
        throw new Error('로그인 응답에 토큰이 없습니다.');
      }

      await saveToken(token);
      setState((s) => ({ ...s, token }));

      // 내 정보 조회
      try {
        const userResponse = await apiClient.getMe();
        const user = userResponse.ok ? userResponse.data : userResponse;
        setState((s) => ({ ...s, user }));
      } catch (meError) {
        console.log('[Auth] Failed to get user after login:', meError.message);
        // 로그인은 성공했지만 사용자 정보 조회 실패 - 계속 진행
      }

      return { success: true };
    } catch (error) {
      console.error('[Auth] Login error:', error);
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
      console.error('[Auth] Signup error:', error);
      const message = error.response?.data?.message || error.message || '회원가입에 실패했습니다.';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await clearToken();
    } catch (error) {
      console.error('[Auth] Logout error:', error);
    }
    setState({ user: null, token: null, initializing: false });
  };

  const refreshMe = async () => {
    if (!state.token) return;
    
    try {
      const response = await apiClient.getMe();
      const user = response.ok ? response.data : response;
      setState((s) => ({ ...s, user }));
    } catch (error) {
      console.error('[Auth] Failed to refresh user:', error);
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
