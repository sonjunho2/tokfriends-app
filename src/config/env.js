// src/config/env.js
import Constants from 'expo-constants';

// 1) EAS 환경변수(EXPO_PUBLIC_*) 우선
const fromPublic = process.env.EXPO_PUBLIC_API_BASE_URL;

// 2) app.json -> expo.extra.apiBaseUrl (로컬/백업 용)
const fromExtra =
  (Constants?.expoConfig?.extra && Constants.expoConfig.extra.apiBaseUrl) ||
  (Constants?.manifest?.extra && Constants.manifest.extra.apiBaseUrl);

// 3) 최종 결정 (없으면 Render API 기본값으로)
const raw = fromPublic || fromExtra || 'https://tok-friends-api.onrender.com';

// 4) 끝에 슬래시 있으면 제거 (axios baseURL 깔끔하게)
export const API_BASE_URL = String(raw).replace(/\/$/, '');

export default { API_BASE_URL };
