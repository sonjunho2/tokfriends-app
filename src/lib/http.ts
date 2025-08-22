// src/lib/http.ts
import axios from 'axios';
import { API_BASE_URL } from '../config';
import * as SecureStore from 'expo-secure-store';

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// 토큰 자동 주입
http.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
