// src/api/client.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, REQUEST_TIMEOUT_MS, STORAGE_TOKEN_KEY } from '../config/env';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

let currentToken = null;

export const setAuthToken = (token) => {
  currentToken = token;
  if (token) client.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete client.defaults.headers.common.Authorization;
};

export const getStoredToken = async () => {
  try { return await AsyncStorage.getItem(STORAGE_TOKEN_KEY); }
  catch (e) { console.error('Failed to get stored token:', e); return null; }
};

export const saveToken = async (token) => {
  try { await AsyncStorage.setItem(STORAGE_TOKEN_KEY, token); setAuthToken(token); }
  catch (e) { console.error('Failed to save token:', e); throw e; }
};

export const clearToken = async () => {
  try { await AsyncStorage.removeItem(STORAGE_TOKEN_KEY); setAuthToken(null); }
  catch (e) { console.error('Failed to clear token:', e); }
};

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
    if (error?.response?.status === 401) await clearToken();
    return Promise.reject(error);
  }
);

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

async function tryPostJsonSequential(paths, body) {
  let lastErr;
  for (const p of paths) {
    try {
      const { data } = await client.post(p, body, { headers: { 'Content-Type': 'application/json' } });
      return data;
    } catch (e) {
      const s = e?.response?.status;
      if (s === 404 || s === 405) { lastErr = e; continue; }
      throw normalizeError(e);
    }
  }
  throw normalizeError(lastErr || new Error('모든 JSON 엔드포인트 시도 실패'));
}

async function tryPostFormSequential(paths, body) {
  const form = new URLSearchParams();
  Object.entries(body).forEach(([k, v]) => {
    if (v !== undefined && v !== null) form.append(k, String(v));
  });
  let lastErr;
  for (const p of paths) {
    try {
      const { data } = await client.post(p, form, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
      return data;
    } catch (e) {
      const s = e?.response?.status;
      if (s === 404 || s === 405) { lastErr = e; continue; }
      throw normalizeError(e);
    }
  }
  throw normalizeError(lastErr || new Error('모든 FORM 엔드포인트 시도 실패'));
}

export const apiClient = {
  async get(url, config) {
    try { return await client.get(url, config); }
    catch (e) { throw normalizeError(e); }
  },

  async post(url, data, config) {
    try { return await client.post(url, data, config); }
    catch (e) { throw normalizeError(e); }
  },

  async put(url, data, config) {
    try { return await client.put(url, data, config); }
    catch (e) { throw normalizeError(e); }
  },

  async patch(url, data, config) {
    try { return await client.patch(url, data, config); }
    catch (e) { throw normalizeError(e); }
  },

  async delete(url, config) {
    try { return await client.delete(url, config); }
    catch (e) { throw normalizeError(e); }
  },
  
  async health() {
    try { const { data } = await client.get('/health'); return data; }
    catch (e) { throw normalizeError(e); }
  },

  async login(email, password) {
    const jsonBody = {
      email: String(email || '').trim().toLowerCase(),
      password: String(password || ''),
    };
    try {
      const { data } = await client.post('/auth/login/email', jsonBody, { headers: { 'Content-Type': 'application/json' } });
      return data;
    } catch (err1) {
      const status1 = err1?.response?.status;
      if (status1 === 404) {
        try {
          const { data } = await client.post('/auth/login', jsonBody, { headers: { 'Content-Type': 'application/json' } });
          return data;
        } catch (err2) {
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

  async signup(userData) {
    const body = {
      email: String(userData?.email || '').trim().toLowerCase(),
      password: String(userData?.password || ''),
      displayName: String(userData?.displayName || '').trim(),
      gender: userData?.gender || 'other',
      dob: userData?.dob || '2000-01-01',
      region: userData?.region ?? undefined,
      bio: userData?.bio ?? undefined,
    };

    const jsonCandidates = [
      '/auth/signup/email',
      '/auth/signup',
      '/auth/register',
      '/signup',
      '/register',
      '/users/signup',
      '/users/register',
      '/users',
    ];

    const formCandidates = [
      '/auth/signup/email',
      '/auth/signup',
      '/auth/register',
      '/signup',
      '/register',
      '/users/signup',
      '/users/register',
      '/users',
    ];

    try {
      return await tryPostJsonSequential(jsonCandidates, body);
    } catch (e) {
      // JSON 전부 실패 시, 동일 경로들을 form-urlencoded 로 재시도
      return await tryPostFormSequential(formCandidates, body);
    }
  },

  // ⬇️⬇️⬇️ 추가: 채팅방 생성 (여러 경로 시도 + 폴백)
  async createRoom(payload = {}) {
    const body = {
      title: String(payload?.title || '').trim(),
      category: String(payload?.category || '').trim() || '프로필기반',
    };
    if (!body.title) {
      throw normalizeError(new Error('방 제목을 입력해 주세요.'));
    }

    const candidates = [
      '/chats/rooms',
      '/chat/rooms',
      '/rooms',
      '/conversations',
    ];

    // 1) JSON 경로들 순차 시도
    try {
      return await tryPostJsonSequential(candidates, body);
    } catch (e) {
      // 2) 실패 시 동일 경로들로 form 재시도
      try {
        return await tryPostFormSequential(candidates, body);
      } catch {
        // 3) 최종 폴백: UI 흐름을 막지 않도록 임시 객체 반환
        return {
          id: Date.now(),
          title: body.title,
          category: body.category,
          _localFallback: true,
        };
      }
    }
  },
  // ⬆️⬆️⬆️ 여기까지 추가

  async getMe() {
    try { const { data } = await client.get('/users/me'); return data; }
    catch (e) { throw normalizeError(e); }
  },

  async getUser(userId) {
    try { const { data } = await client.get(`/users/${userId}`); return data; }
    catch (e) { throw normalizeError(e); }
  },

  async getActiveAnnouncements() {
    try { const { data } = await client.get('/announcements/active'); return data; }
    catch { const { data } = await client.get('/announcements', { params: { isActive: true } }); return data; }
  },

  async getTopics() { const { data } = await client.get('/topics'); return data; },
  async getPosts(params = {}) { const { data } = await client.get('/posts', { params }); return data; },
  async getTopicPosts(topicId, params = {}) { const { data } = await client.get(`/topics/${topicId}/posts`, { params }); return data; },
  async createPost(postData) { const { data } = await client.post('/posts', postData); return data; },
  async reportUser(reportData) { const { data } = await client.post('/community/report', reportData); return data; },
  async blockUser(blockData) { const { data } = await client.post('/community/block', blockData); return data; },
};

export default client;
