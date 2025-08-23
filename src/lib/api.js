// src/lib/api.js
import axios from 'axios';
import { API_BASE_URL } from '../config/env';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15s
});

// 요청/응답 로깅 + 소요시간 측정
api.interceptors.request.use((config) => {
  config.metadata = { start: Date.now() };
  const base = API_BASE_URL?.replace(/\/$/, '') || '';
  const url = `${base}${config.url || ''}`;
  console.log(`[HTTP] → ${String(config.method).toUpperCase()} ${url}`);
  return config;
});

api.interceptors.response.use(
  (res) => {
    const ms = res?.config?.metadata ? Date.now() - res.config.metadata.start : 0;
    console.log(`[HTTP] ← ${res.status} ${res.config?.url} (${ms}ms)`);
    return res;
  },
  (err) => {
    const cfg = err.config || {};
    const ms = cfg?.metadata ? Date.now() - cfg.metadata.start : 0;
    const status = err.response?.status;
    const body = err.response?.data;
    console.log('[HTTP ERROR]', JSON.stringify({
      url: cfg?.url, method: cfg?.method, status, code: err.code, ms, body
    }, null, 2));
    return Promise.reject(err);
  }
);
