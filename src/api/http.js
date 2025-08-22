// src/api/http.js
import axios from 'axios';
import { API_BASE_URL } from '../config/env';

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 설정
export const setHttpToken = (token) => {
  if (token) {
    http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// 토큰 제거
export const clearHttpToken = () => {
  delete http.defaults.headers.common['Authorization'];
};

// 요청 인터셉터
http.interceptors.request.use(
  (config) => {
    console.log(`[HTTP] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[HTTP Request Error]', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
http.interceptors.response.use(
  (response) => {
    console.log(`[HTTP Response] ${response.status}`, response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`[HTTP Error] ${error.response.status}`, error.response.data);
    } else if (error.request) {
      console.error('[HTTP Error] No response received');
    } else {
      console.error('[HTTP Error]', error.message);
    }
    return Promise.reject(error);
  }
);

export default http;
