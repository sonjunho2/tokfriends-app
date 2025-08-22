// src/config.js
import Constants from 'expo-constants';

const extra =
  (Constants?.expoConfig && Constants.expoConfig.extra) ||
  (Constants?.manifest && Constants.manifest.extra) ||
  {};

export const API_BASE_URL =
  (typeof extra.apiBaseUrl === 'string' && extra.apiBaseUrl) ||
  'https://tok-friends-api.onrender.com';

// 필요 시 다른 환경변수도 여기서 꺼내 쓰면 됩니다.
// export const SENTRY_DSN = extra.sentryDsn || null;
