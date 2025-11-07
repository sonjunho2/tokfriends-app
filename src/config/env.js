import Constants from 'expo-constants';
import appConfig from '../../app.config';

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
  appConfig?.extra?.ADMIN_OVERRIDE_CODES;

export const ADMIN_OVERRIDE_CODES = parseAdminOverrideCodes(rawAdminOverrideCodes);
export const API_BASE_URL = (
  process.env.TOK_API_BASE_URL ||
  appConfig?.extra?.TOK_API_BASE_URL ||
  'https://tok-friends-api.onrender.com'
).replace(/\/$/, '');
export const REQUEST_TIMEOUT_MS = 10000;
export const STORAGE_TOKEN_KEY = 'tokfriends_access_token';

export default {
  API_BASE_URL,
  REQUEST_TIMEOUT_MS,
  STORAGE_TOKEN_KEY,
  ADMIN_OVERRIDE_CODES,
};
