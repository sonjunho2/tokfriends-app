import Constants from 'expo-constants';

const parseAdminOverrideCodes = (input) => {
  if (!input) {
    return [];
  }
  if (Array.isArray(input)) {
    return input
      .map((value) => String(value || '').trim())
      .filter(Boolean);
  }
  if (typeof input === 'string') {
    return input
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
  }
  return [];
};

// 환경변수 우선순위: EXPO_PUBLIC_ > 일반 환경변수 > Expo extra > 기본값
const rawAdminOverrideCodes =
  process.env.EXPO_PUBLIC_ADMIN_OVERRIDE_CODES ||
  process.env.ADMIN_OVERRIDE_CODES ||
  Constants?.expoConfig?.extra?.ADMIN_OVERRIDE_CODES ||
  Constants?.manifest?.extra?.ADMIN_OVERRIDE_CODES ||
  // 모든 값이 없으면 기본값 '123456' 사용
  '123456';

export const ADMIN_OVERRIDE_CODES = parseAdminOverrideCodes(rawAdminOverrideCodes);

// API 주소 우선순위: TOK_API_BASE_URL > EXPO_PUBLIC_API_BASE_URL > Expo extra > 기본값
const rawApiBaseUrl =
  process.env.TOK_API_BASE_URL ||
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  Constants?.expoConfig?.extra?.TOK_API_BASE_URL ||
  Constants?.manifest?.extra?.TOK_API_BASE_URL ||
  'https://tok-friends-api.onrender.com';

export const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, '');
export const REQUEST_TIMEOUT_MS = 10000;
export const STORAGE_TOKEN_KEY = 'tokfriends_access_token';

// Added: Support disabling authentication and payment for local testing.
export const USE_DUMMY_AUTH = (() => {
  const val =
    process.env.EXPO_PUBLIC_DISABLE_AUTH ||
    process.env.DISABLE_AUTH_AND_PAYMENT ||
    process.env.EXPO_PUBLIC_USE_DUMMY_AUTH;
  if (val === undefined || val === null) return false;
  const lowered = String(val).toLowerCase();
  return lowered === '1' || lowered === 'true' || lowered === 'yes';
})();

export default {
  API_BASE_URL,
  REQUEST_TIMEOUT_MS,
  STORAGE_TOKEN_KEY,
  USE_DUMMY_AUTH,
  ADMIN_OVERRIDE_CODES,
};
