import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, REQUEST_TIMEOUT_MS, STORAGE_TOKEN_KEY } from '../config/env';

// 단일 axios 인스턴스
const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 토큰 관리
let currentToken = null;

export const setAuthToken = (token) => {
  currentToken = token || null;
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common.Authorization;
  }
};

export const getStoredToken = async () => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Failed to get stored token:', error);
    return null;
  }
};

export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(STORAGE_TOKEN_KEY, token);
    setAuthToken(token);
  } catch (error) {
    console.error('Failed to save token:', error);
    throw error;
  }
};

export const clearToken = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_TOKEN_KEY);
    setAuthToken(null);
  } catch (error) {
    console.error('Failed to clear token:', error);
  }
};

// 요청 인터셉터: 토큰 자동 주입
client.interceptors.request.use(
  async (config) => {
    if (!currentToken) {
      const storedToken = await getStoredToken();
      if (storedToken) {
        setAuthToken(storedToken);
      }
    }
    console.log(`[HTTP] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[HTTP Request Error]', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401 시 토큰 삭제
client.interceptors.response.use(
  (response) => {
    console.log(`[HTTP Response] ${response.status} ${response.config?.url}`);
    return response;
  },
  async (error) => {
    if (error?.response) {
      console.error(`[HTTP Error] ${error.response.status}`, error.response.data);
      if (error.response.status === 401) {
        await clearToken();
        // 네비게이션 전환은 AuthContext/라우팅 가드에서 처리
      }
    } else if (error?.request) {
      console.error('[HTTP Error] No response received');
    } else {
      console.error('[HTTP Error]', error?.message);
    }
    return Promise.reject(error);
  }
);

// API 메서드들
export const apiClient = {
  // 헬스체크
  async health() {
    const res = await client.get('/health');
    return res.data;
  },

  // 로그인 (x-www-form-urlencoded) + 토큰 저장
  async login(email, password) {
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);

    const res = await client.post('/auth/login/email', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const token = res?.data?.access_token || res?.data?.token;
    if (token) {
      await saveToken(token);
    }
    return res.data;
  },

  // 회원가입
  async signup(userData) {
    const res = await client.post('/auth/signup/email', userData);
    return res.data;
  },

  // 내 정보 조회
  async getMe() {
    const res = await client.get('/users/me');
    return res.data;
  },

  // 사용자 단건
  async getUser(userId) {
    const res = await client.get(`/users/${userId}`);
    return res.data;
  },

  // 활성 공지사항
  async getActiveAnnouncements() {
    try {
      const res = await client.get('/announcements/active');
      return res.data;
    } catch {
      const res = await client.get('/announcements', { params: { isActive: true } });
      return res.data;
    }
  },

  // 토픽 목록
  async getTopics() {
    const res = await client.get('/topics');
    return res.data;
  },

  // 게시글 목록
  async getPosts(params = {}) {
    const res = await client.get('/posts', { params });
    return res.data;
  },

  // 토픽별 게시글
  async getTopicPosts(topicId, params = {}) {
    const res = await client.get(`/topics/${topicId}/posts`, { params });
    return res.data;
  },

  // 게시글 작성
  async createPost(postData) {
    const res = await client.post('/posts', postData);
    return res.data;
  },

  // 신고
  async reportUser(reportData) {
    const res = await client.post('/community/report', reportData);
    return res.data;
  },

  // 차단
  async blockUser(blockData) {
    const res = await client.post('/community/block', blockData);
    return res.data;
  },
};

export default client;
