/tokfriends-app/src/lib/api.ts
// 기본 설정
const API_BASE = import.meta.env.VITE_TOK_API_BASE || (typeof process !== 'undefined' ? process.env.TOK_API_BASE : '') || '';
const WS_BASE  = import.meta.env.VITE_TOK_WS_BASE  || (typeof process !== 'undefined' ? process.env.TOK_WS_BASE  : '') || '';
const JWT_KEY  = import.meta.env.VITE_TOK_JWT_STORAGE_KEY || (typeof process !== 'undefined' ? process.env.TOK_JWT_STORAGE_KEY : 'tokfriends.jwt');

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const env = {
  API_BASE,
  WS_BASE,
  JWT_KEY,
};

// 토큰 저장/조회
export const tokenStore = {
  get(): string | null {
    try { return localStorage.getItem(JWT_KEY); } catch { return null; }
  },
  set(token: string) {
    try { localStorage.setItem(JWT_KEY, token); } catch {}
  },
  clear() {
    try { localStorage.removeItem(JWT_KEY); } catch {}
  },
};

// 공통 요청 래퍼
async function request<T = any>(path: string, options: { method?: HttpMethod; body?: any; auth?: boolean } = {}): Promise<T> {
  if (!API_BASE) throw new Error('API base URL not configured');
  const url = `${API_BASE.replace(/\/+$/,'')}/${path.replace(/^\/+/, '')}`;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.auth) {
    const tk = tokenStore.get();
    if (tk) headers['Authorization'] = `Bearer ${tk}`;
  }

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  // 204 No Content
  if (res.status === 204) return {} as T;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

// ==== 엔드포인트별 헬퍼 ====

// Auth
export const authApi = {
  async loginEmail(email: string, password: string) {
    return request<{ ok: boolean; token?: string; data?: any }>('auth/login/email', {
      method: 'POST',
      body: { email, password },
    });
  },
  async signupEmail(email: string, password: string, dob: string, gender: string) {
    return request('auth/signup/email', { method: 'POST', body: { email, password, dob, gender } });
  },
};

// Discover
export const discoverApi = {
  async list(params: { gender?: string; ageMin?: number; ageMax?: number; region?: string } = {}) {
    const q = new URLSearchParams();
    if (params.gender) q.set('gender', params.gender);
    if (typeof params.ageMin === 'number') q.set('ageMin', String(params.ageMin));
    if (typeof params.ageMax === 'number') q.set('ageMax', String(params.ageMax));
    if (params.region) q.set('region', params.region);
    return request<{ ok: boolean; data: any[] }>(`discover?${q.toString()}`, { method: 'GET', auth: true });
  },
};

// Friendships
export const friendshipsApi = {
  async send(requesterId: string, addresseeId: string) {
    return request<{ ok: boolean; data: any }>('friendships', {
      method: 'POST',
      auth: true,
      body: { requesterId, addresseeId },
    });
  },
  async accept(id: string) {
    return request<{ ok: boolean; data: any }>(`friendships/${id}/accept`, { method: 'POST', auth: true });
  },
  async decline(id: string) {
    return request<{ ok: boolean; data: any }>(`friendships/${id}/decline`, { method: 'POST', auth: true });
  },
  async cancel(id: string) {
    return request<{ ok: boolean; data: any }>(`friendships/${id}/cancel`, { method: 'POST', auth: true });
  },
  async list(userId: string) {
    const q = new URLSearchParams({ userId });
    return request<{ ok: boolean; data: any[] }>(`friendships?${q.toString()}`, { method: 'GET', auth: true });
  },
};

// Announcements (옵션)
export const announcementsApi = {
  async active() {
    return request<{ ok: boolean; data: any[] }>('announcements/active', { method: 'GET' });
  },
};

// Metrics (관리자용 요약)
export const metricsApi = {
  async summary() {
    return request<{ ok: boolean; data: any }>('metrics', { method: 'GET', auth: true });
  },
};
