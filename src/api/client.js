// src/api/client.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, REQUEST_TIMEOUT_MS, STORAGE_TOKEN_KEY } from '../config/env';
import { applyRouteMapToAxiosConfig } from './routeMap'; // ★ 추가

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

let currentToken = null;

export const setAuthToken = (token) => {
  currentToken = token || null;
  if (client?.defaults?.headers?.common) {
    delete client.defaults.headers.common.Authorization;
  }
};

const unauthJsonConfig = (overrides = {}) => {
  const baseTransform = (
    payload,
    headers,
  ) => {
    if (headers && 'Authorization' in headers) delete headers.Authorization;
    return typeof payload === 'string' ? payload : JSON.stringify(payload);
  };

  const extraTransforms = overrides.transformRequest
    ? Array.isArray(overrides.transformRequest)
      ? overrides.transformRequest
      : [overrides.transformRequest]
    : [];

  return {
    __unauth: true,
    ...overrides,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(overrides.headers || {}),
    },
    transformRequest: [baseTransform, ...extraTransforms],
  };
};

const unauthConfig = (overrides = {}) => ({
  __unauth: true,
  ...overrides,
  headers: {
    Accept: 'application/json',
    ...(overrides.headers || {}),
  },
});

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

    // ★ 경로 자동 매핑 추가 (여기 한 줄이 핵심)
    let workingConfig = applyRouteMapToAxiosConfig(config);

    const headers = workingConfig.headers || (workingConfig.headers = {});

    if (workingConfig.__unauth === true) {
      delete headers.Authorization;
      if (headers.common) delete headers.common.Authorization;
      if (headers.post) delete headers.post.Authorization;
    } else if (currentToken && !headers.Authorization) {
      headers.Authorization = `Bearer ${currentToken}`;
    }

    return workingConfig;
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
    const target = typeof url === 'string' ? url.trim() : '';
    if (!target) {
      throw normalizeError(new Error('삭제할 경로가 필요합니다.'));
    }

    try {
      return await client.delete(target, config);
    } catch (err) {
      if (err?.response?.status === 410) {
        const goneError = new Error('요청하신 리소스가 더 이상 제공되지 않습니다. 고객센터로 문의해 주세요.');
        goneError.status = 410;
        throw goneError;
      }
      throw normalizeError(err);
    }
  },

  async health() {
    try { const { data } = await client.get('/health', unauthConfig()); return data; }
    catch (e) { throw normalizeError(e); }
  },

  async login(email, password) {
    const payload = {
      email: String(email || '').trim().toLowerCase(),
      password: String(password || ''),
    };

    try {
      const { data } = await client.post('/auth/login/email', payload, unauthJsonConfig());
      return data;
    } catch (err) {
      if (err?.response?.status === 410) {
        const goneError = new Error('이메일 로그인 기능이 더 이상 지원되지 않습니다. 고객센터로 문의해 주세요.');
        goneError.status = 410;
        throw goneError;
      }
      throw normalizeError(err);
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

    try {
      const { data } = await client.post('/auth/signup/email', body, unauthJsonConfig());
      return data;
    } catch (err) {
      if (err?.response?.status === 410) {
        const goneError = new Error('회원가입이 더 이상 지원되지 않습니다. 고객센터로 문의해 주세요.');
        goneError.status = 410;
        throw goneError;
      }
      throw normalizeError(err);
    }
  },

  async createRoom(payload = {}) {
    const body = {
      title: String(payload?.title || '').trim(),
      category: String(payload?.category || '').trim() || '프로필기반',
    };
    if (!body.title) {
      throw normalizeError(new Error('방 제목을 입력해 주세요.'));
    }

    try {
      const { data } = await client.post('/chats/rooms', body, {
        headers: { 'Content-Type': 'application/json' },
      });
      return data;
    } catch (err) {
      if (err?.response?.status === 410) {
        const goneError = new Error('채팅방 생성이 더 이상 지원되지 않습니다. 고객센터로 문의해 주세요.');
        goneError.status = 410;
        throw goneError;
      }
      throw normalizeError(err);
    }
  },

  async requestPhoneOtp(payload = {}) {
    const digits = String(payload?.phone || '')
      .replace(/[^0-9]/g, '')
      .replace(/^82/, '0');
    if (!digits) {
      throw normalizeError(new Error('휴대폰 번호를 입력해 주세요.'));
    }

    const body = {
      phone: digits,
      countryCode: payload?.countryCode || 'KR',
    };

    try {
      const { data } = await client.post('/auth/otp/request', body, unauthJsonConfig());
      return data;
    } catch (err) {
      if (err?.response?.status === 410) {
        const goneError = new Error('휴대폰 인증번호 요청이 더 이상 지원되지 않습니다. 고객센터로 문의해 주세요.');
        goneError.status = 410;
        throw goneError;
      }
      throw normalizeError(err);
    }
  },

  async verifyPhoneOtp(payload = {}) {
    const digits = String(payload?.phone || '')
      .replace(/[^0-9]/g, '')
      .replace(/^82/, '0');
    const code = String(payload?.code || '').replace(/\D/g, '');
    if (!digits || code.length < 4) {
      throw normalizeError(new Error('휴대폰 번호와 인증번호를 확인해 주세요.'));
    }

    const body = {
      phone: digits,
      code,
      requestId: payload?.requestId || payload?.verificationId || undefined,
    };

    try {
      const { data } = await client.post('/auth/otp/verify', body, unauthJsonConfig());
      return data;
    } catch (err) {
      if (err?.response?.status === 410) {
        const goneError = new Error('휴대폰 인증번호 확인이 더 이상 지원되지 않습니다. 고객센터로 문의해 주세요.');
        goneError.status = 410;
        throw goneError;
      }
      throw normalizeError(err);
    }
  },

  async completePhoneSignup(payload = {}) {
    const body = {
      phone: String(payload?.phone || '').replace(/[^0-9]/g, ''),
      verificationId: payload?.verificationId,
      nickname: String(payload?.nickname || '').trim(),
      birthYear: payload?.birthYear,
      gender: payload?.gender || 'other',
      region: payload?.region || null,
      headline: payload?.headline || '',
      bio: payload?.bio || '',
      avatarUri: payload?.avatarUri || undefined,
    };

    if (!body.phone || !body.verificationId) {
      throw normalizeError(new Error('인증 정보가 누락되었습니다.'));
    }
    if (!body.nickname || !body.birthYear || !body.headline || !body.bio) {
      throw normalizeError(new Error('필수 가입 정보를 모두 입력해 주세요.'));
    }

    try {
      const { data } = await client.post(
        '/auth/phone/complete-profile',
        body,
        unauthJsonConfig()
      );
      return data;
    } catch (err) {
      if (err?.response?.status === 410) {
        const goneError = new Error('휴대폰 기반 가입 절차가 더 이상 지원되지 않습니다. 고객센터로 문의해 주세요.');
        goneError.status = 410;
        throw goneError; 
      }
      throw normalizeError(err);
    }
  },

  async getLegalDocument(slug) {
    const key = String(slug || '').replace(/[^0-9a-zA-Z-_]/g, '').toLowerCase();
    if (!key) {
      throw normalizeError(new Error('문서 식별자가 필요합니다.'));
    }
    const candidates = [
      `/legal-documents/${key}`,
      `/legal/${key}`,
      `/policies/${key}`,
      `/cms/pages/${key}`,
    ];
    let lastErr;
    for (const path of candidates) {
      try {
        const { data } = await client.get(path);
        return data;
      } catch (err) {
        const status = err?.response?.status;
        if (status === 404 || status === 405) {
          lastErr = err;
          continue;
        }
        throw normalizeError(err);
      }
    }
    throw normalizeError(lastErr || new Error('약관 문서를 찾을 수 없습니다.'));
  },

  async ensureDirectRoom(userId, options = {}) {
    const target = userId || options?.targetUserId || options?.participantId;
    if (!target) {
      throw normalizeError(new Error('대화할 상대의 ID가 필요합니다.'));
    }
    const body = {
      targetUserId: target,
      participantId: target,
    };

    try {
      const { data } = await client.post('/chat/direct', body);
      if (data?.room) return data.room;
      return data;
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        return {
          id: `local-${Date.now()}`,
          participants: [target],
          title: options?.title || '새 대화',
          isFallback: true,
        };
      }
      if (status === 410) {
        const goneError = new Error('1:1 대화 생성이 더 이상 지원되지 않습니다. 고객센터로 문의해 주세요.');
        goneError.status = 410;
        throw goneError;
      }
      throw normalizeError(err);
    }
  },

  async getPointProducts() {
    const endpoints = [
      '/store/point-products',
      '/store/products',
      '/shop/points',
      '/payments/products',
    ];
    let lastErr;
    for (const path of endpoints) {
      try {
        const { data } = await client.get(path);
        if (Array.isArray(data?.items)) return data.items;
        if (Array.isArray(data?.data)) return data.data;
        if (Array.isArray(data)) return data;
      } catch (err) {
        const status = err?.response?.status;
        if (status === 404 || status === 405) {
          lastErr = err;
          continue;
        }
        throw normalizeError(err);
      }
    }
    if (lastErr) throw normalizeError(lastErr);
    return [];
  },

  async confirmPurchase(payload = {}) {
    const body = {
      productId: payload?.productId,
      transactionId: payload?.transactionId,
      receipt: payload?.receipt,
      platform: payload?.platform,
    };
    const endpoints = [
      '/store/purchases/confirm',
      '/payments/confirm',
      '/iap/confirm',
    ];
    let lastErr;
    for (const path of endpoints) {
      try {
        const { data } = await client.post(path, body);
        return data;
      } catch (err) {
        const status = err?.response?.status;
        if (status === 404 || status === 405) {
          lastErr = err;
          continue;
        }
        throw normalizeError(err);
      }
    }
    throw normalizeError(lastErr || new Error('구매 확인에 실패했습니다.'));
  },

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

  async getGiftOptions() {
    try {
      const { data } = await client.get('/gifts');
      return data;
    } catch (err) {
      if (err?.response?.status === 404) {
        return [];
      }
      throw normalizeError(err);
    }
  },
};

export default client;
