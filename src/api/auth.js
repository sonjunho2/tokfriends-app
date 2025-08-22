// src/api/auth.js
import { http, setAuthToken } from '../lib/http';

/** 이메일 로그인 */
export async function loginWithEmail(email, password) {
  const data = await http.post('/auth/login/email', { email, password });
  if (data && data.accessToken) {
    setAuthToken(data.accessToken);
  }
  return data; // { accessToken, user, ... } 형식 가정
}

/** 이메일 회원가입 */
export async function signupWithEmail(email, password, name) {
  const data = await http.post('/auth/signup/email', { email, password, name });
  // 회원가입 직후 자동 로그인 토큰을 주지 않는 API라면 setAuthToken 생략
  if (data && data.accessToken) {
    setAuthToken(data.accessToken);
  }
  return data;
}

/** 토큰 수동 주입(소셜 로그인 등 외부 경로에서 받은 경우) */
export function setAuthTokenManually(token) {
  setAuthToken(token);
}
