// src/api/client.js
import axios from 'axios';
import { applyRouteMapToAxiosConfig } from './routeMap';

// --- 환경설정 ---
// 앱 요약에 따르면 baseURL은 EXPO_PUBLIC_API_BASE_URL에서 가져옵니다.  :contentReference[oaicite:11]{index=11}
const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  'https://tok-friends-api.onrender.com';

// --- 인스턴스 ---
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true, // 앱은 bearer + cookie 겸용 가능 구조였음  :contentReference[oaicite:12]{index=12}
  headers: {
    Accept: 'application/json',
  },
});

// --- 토큰 저장 위치 (앱 요약: storage 키 'tokfriends_access_token') ---  :contentReference[oaicite:13]{index=13}
async function getAccessToken() {
  try {
    // Expo 환경에서 AsyncStorage를 사용한다면 실제 프로젝트에서 불러오는 유틸을 사용하세요.
    // 여기서는 런타임 오류 방지를 위해 window.localStorage를 우선 시도합니다.
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('tokfriends_access_token') || null;
    }
    return null;
  } catch {
    return null;
  }
}

// --- 요청 인터셉터: 경로 매핑 + 토큰 부착 ---
api.interceptors.request.use(
  async (config) => {
    // 경로 호환 매핑 먼저 적용
    config = applyRouteMapToAxiosConfig(config);

    // 인증 필요 없는 호출(health 등)은 기존 로직대로 조건 처리 했다면 그 조건을 유지하세요.
    // 여기서는 기본적으로 토큰 부착 시도만 합니다.
    const token = await getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      // API는 Authorization: Bearer <token>을 기대함  :contentReference[oaicite:14]{index=14}
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// --- 응답/에러 인터셉터(기본형) ---
// 기존에 에러 처리(401 시 토큰 정리 등)가 있었다면 그 로직을 여기에 그대로 합치세요.
// 아래는 안전한 no-op 기본형입니다.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // 필요 시 401 처리 (예: 토큰 삭제, 로그인 화면 이동)
    return Promise.reject(err);
  }
);

export default api;
