import { apiClient } from './client';

export async function loginWithEmail(email, password) {
  return await apiClient.login(email, password);
}

export async function signupWithEmail(email, password, displayName, gender, dob) {
  return await apiClient.signup({ email, password, displayName, gender, dob });
}

export async function getMe() {
  return await apiClient.getMe();
}
