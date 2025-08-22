// src/config.ts
import Constants from 'expo-constants';

type Extra = { apiBaseUrl?: string };
const extra = (Constants.expoConfig?.extra || Constants.manifest?.extra || {}) as Extra;

export const API_BASE_URL = extra.apiBaseUrl || 'https://tok-friends-api.onrender.com';
