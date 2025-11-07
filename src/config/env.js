import Constants from 'expo-constants';

// 환경변수 우선순위: EXPO_PUBLIC_ > app.json extra > 기본값
const fromPublic = process.env.EXPO_PUBLIC_API_BASE_URL;
const fromExtra = Constants?.expoConfig?.extra?.apiBaseUrl || Constants?.manifest?.extra?.apiBaseUrl;

export const API_BASE_URL = (process.env.TOK_API_BASE_URL || appConfig?.extra?.TOK_API_BASE_URL || 'https://tok-friends-api.onrender.com').replace(/\/$/, '');
export const REQUEST_TIMEOUT_MS = 10000;
export const STORAGE_TOKEN_KEY = 'tokfriends_access_token';

export default {
  API_BASE_URL,
  REQUEST_TIMEOUT_MS,
  STORAGE_TOKEN_KEY,
};
