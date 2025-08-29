import { apiClient } from './client';

export async function loginWithEmail(email, password) {
  // apiClient.login 내부에서 토큰을 저장하므로 여기서는 결과만 반환
  return await apiClient.login(email, password);
}

export async function signupWithEmail(email, password, displayName, gender, dob) {
  return await apiClient.signup({ email, password, displayName, gender, dob });
}

export async function getMe() {
  return await apiClient.getMe();
}
