// src/lib/http.js
import { API_BASE_URL } from '../config';

// 모듈 내부에 토큰을 기억(앱 재시작시에는 로그인 로직에서 다시 setAuthToken 호출)
let authToken = null;

/** 액세스 토큰 설정 (로그인 성공 후 호출) */
export function setAuthToken(token) {
  authToken = token || null;
}

/** 내부 공통 요청기 */
async function request(path, { method = 'GET', body, headers } = {}) {
  const base = API_BASE_URL.endsWith('/')
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;

  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
  };
  if (authToken) {
    opts.headers.Authorization = `Bearer ${authToken}`;
  }
  if (body !== undefined) {
    opts.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const res = await fetch(url, opts);

  // JSON/텍스트 자동 파싱
  const raw = await res.text();
  let data = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = raw;
  }

  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// 공개 API
export const http = {
  get: (path, headers) => request(path, { method: 'GET', headers }),
  post: (path, body, headers) => request(path, { method: 'POST', body, headers }),
  put: (path, body, headers) => request(path, { method: 'PUT', body, headers }),
  del: (path, headers) => request(path, { method: 'DELETE', headers }),
};
