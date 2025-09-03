// src/api/client.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, REQUEST_TIMEOUT_MS, STORAGE_TOKEN_KEY } from '../config/env';

// ─── axios instance ─────────────────────────────────────────────────────────────
const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── token helpers ──────────────────────────────────────────────────────────────
let currentToken = null;

export const setAuthToken = (token) => {
  currentToken = token;
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common.Authorization;
  }
};

export const getStoredToken = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_TOKEN_KEY);
  } catch (e) {
    console.error('Failed to get stored token:', e);
    return null;
  }
};

export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(STORAGE_TOKEN_KEY, token);
    setAuthToken(token);
  } catch (e) {
    console.error('Failed to save token:', e);
    throw e;
  }
};

export const clearToken = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_TOKEN_KEY);
    setAuthToken(null);
  } catch (e) {
    console.error('Failed to clear token:', e);
  }
};

// ─── interceptors ───────────────────────────────────────────────────────────────
client.interceptors.request.use(
  async (config) => {
    if (!currentToken) {
      const storedToken = await getStoredToken();
      if (storedToken) setAuthToken(storedToken);
    }
    // console.log(`[HTTP] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error?.response?.status === 401) {
      await clearToken();
    }
    return Promise.reject(error);
  }
);

// ─── error normalizer ───────────────────────────────────────────────────────────
const normalizeError = (err) => {
  const msg =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    '요청 처리 중 오류가 발생했습니다.';
  const e = new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  e.status = err?.response?.status;
  return e;
};

// ─── API methods ────────────────────────────────────────────────────────────────
export const apiClient = {
  // 헬스
  async health() {
    try {
      const { data } = await client.get('/health');
      return data;
    } catch (e) {
      throw normalizeError(e);
    }
  },

  // 로그인: JSON → (실패) form-urlencoded, 경로는 /auth/login/email → (404일 때) /auth/login
  async login(email, password) {
    const jsonBody = {
      email: String(email || '').trim().toLowerCase(),
      password: String(password || ''),
    };

    // 1) JSON, /auth/login/email
    try {
      const { data } = await client.post('/auth/login/email', jsonBody, {
        headers: { 'Content-Type': 'application/json' },
      });
      return data;
    } catch (err1) {
      const status1 = err1?.response?.status;

      // 2) JSON, /auth/login (경로 폴백)
      if (status1 === 404) {
        try {
          const { data } = await client.post('/auth/login', jsonBody, {
            headers: { 'Content-Type': 'application/json' },
          });
          return data;
        } catch (err2) {
          // 3) form-urlencoded, /auth/login/email (콘텐츠 타입 이슈 폴백)
          try {
            const form = new URLSearchParams();
            form.append('email', jsonBody.email);
            form.append('password', jsonBody.password);
            const { data } = await client.post('/auth/login/email', form, {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            return data;
          } catch (err3) {
            throw normalizeError(err3);
          }
        }
      }

      // 3) form-urlencoded, /auth/login/email
      try {
        const form = new URLSearchParams();
        form.append('email', jsonBody.email);
        form.append('password', jsonBody.password);
        const { data } = await client.post('/auth/login/email', form, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        return data;
      } catch (err4) {
        throw normalizeError(err4);
      }
    }
  },

  // 회원가입: /auth/signup/email → (404/400) /auth/signup
  async signup(userData) {
    const body = {
      email: String(userData?.email || '').trim().toLowerCase(),
      password: String(userData?.password || ''),
      displayName: String(userData?.displayName || '').trim(),
      gender: userData?.gender || 'other',
      dob: userData?.dob || '2000-01-01', // YYYY-MM-DD
    };

    // 1) /auth/signup/email
    try {
      const { data } = await client.post('/auth/signup/email', body, {
        headers: { 'Content-Type': 'application/json' },
      });
      return data;
    } catch (err1) {
      const status1 = err1?.response?.status;

      // 2) /auth/signup (경로 폴백)
      if (status1 === 404 || status1 === 400) {
        try {
          const { data } = await client.post('/auth/signup', body, {
            headers: { 'Content-Type': 'application/json' },
          });
          return data;
        } catch (err2) {
          throw normalizeError(err2);
        }
      }
      throw normalizeError(err1);
    }
  },

  // 내 정보
  async getMe() {
    try {
      const { data } = await client.get('/users/me');
      return data;
    } catch (e) {
      throw normalizeError(e);
    }
  },

  // 사용자
  async getUser(userId) {
    try {
      const { data } = await client.get(`/users/${userId}`);
      return data;
    } catch (e) {
      throw normalizeError(e);
    }
  },

  // 공지
  async getActiveAnnouncements() {
    try {
      const { data } = await client.get('/announcements/active');
      return data;
    } catch {
      const { data } = await client.get('/announcements', { params: { isActive: true } });
      return data;
    }
  },

  // (아래는 기존 그대로)
  async getTopics() {
    const { data } = await client.get('/topics');
    return data;
  },
  async getPosts(params = {}) {
    const { data } = await client.get('/posts', { params });
    return data;
  },
  async getTopicPosts(topicId, params = {}) {
    const { data } = await client.get(`/topics/${topicId}/posts`, { params });
    return data;
  },
  async createPost(postData) {
    const { data } = await client.post('/posts', postData);
    return data;
  },
  async reportUser(reportData) {
    const { data } = await client.post('/community/report', reportData);
    return data;
  },
  async blockUser(blockData) {
    const { data } = await client.post('/community/block', blockData);
    return data;
  },
};

export default client;
