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

// ─── helpers ───────────────────────────────────────────────────────────────────
async function tryPostJsonSequential(paths, body) {
  let lastErr;
  for (const p of paths) {
    try {
      const { data } = await client.post(p, body, {
        headers: { 'Content-Type': 'application/json' },
      });
      return data;
    } catch (e) {
      const s = e?.response?.status;
      // 경로/메서드 미지원이면 다음 후보로 진행
      if (s === 404 || s === 405) {
        lastErr = e;
        continue;
      }
      // 기타 에러는 즉시 반환
      throw normalizeError(e);
    }
  }
  throw normalizeError(lastErr || new Error('모든 엔드포인트 시도 실패'));
}

// ─── API methods ────────────────────────────────────────────────────────────────
export const apiClient = {
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
          // 3) form-urlencoded, /auth/login/email
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

  // 회원가입: 여러 백엔드 변형 엔드포인트로 폴백
  async signup(userData) {
    const body = {
      email: String(userData?.email || '').trim().toLowerCase(),
      password: String(userData?.password || ''),
      displayName: String(userData?.displayName || '').trim(),
      gender: userData?.gender || 'other',
      dob: userData?.dob || '2000-01-01', // YYYY-MM-DD
      region: userData?.region ?? undefined,
      bio: userData?.bio ?? undefined,
    };

    // 가장 흔한 후보들을 순서대로 시도
    const candidates = [
      '/auth/signup/email',
      '/auth/signup',
      '/auth/register',
      '/signup',
      '/register',
      '/users/signup',
      '/users/register',
      '/users', // 일부 서버는 POST /users 로 생성
    ];

    return await tryPostJsonSequential(candidates, body);
  },

  async getMe() {
    try {
      const { data } = await client.get('/users/me');
      return data;
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async getUser(userId) {
    try {
      const { data } = await client.get(`/users/${userId}`);
      return data;
    } catch (e) {
      throw normalizeError(e);
    }
  },

  async getActiveAnnouncements() {
    try {
      const { data } = await client.get('/announcements/active');
      return data;
    } catch {
      const { data } = await client.get('/announcements', { params: { isActive: true } });
      return data;
    }
  },

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
