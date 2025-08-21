// src/store/auth.js
import * as SecureStore from 'expo-secure-store';
import apiClient from '../api/client';

class AuthStore {
  constructor() {
    this.user = null;
    this.token = null;
    this.loading = true;
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(listener => listener({
      user: this.user,
      token: this.token,
      loading: this.loading,
    }));
  }

  async init() {
    try {
      this.loading = true;
      this.notify();
      
      const [token, userId, email] = await Promise.all([
        SecureStore.getItemAsync('authToken'),
        SecureStore.getItemAsync('userId'),
        SecureStore.getItemAsync('email'),
      ]);
      
      if (token && userId) {
        this.token = token;
        
        try {
          const userData = await apiClient.getUser(userId);
          this.user = userData;
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          this.user = { id: userId, email };
        }
      }
    } catch (error) {
      console.error('Auth init error:', error);
      await this.clearAuth();
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  async signup({ email, password, displayName, gender, dob }) {
    try {
      const response = await apiClient.signup({
        email,
        password,
        displayName,
        gender,
        dob,
      });
      
      if (response.token && response.user) {
        await this.saveAuth(response.token, response.user);
        return { success: true, user: response.user };
      }
      
      throw new Error('Invalid signup response');
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: error.message || '회원가입에 실패했습니다.',
      };
    }
  }

  async login({ email, password }) {
    try {
      const response = await apiClient.login({ email, password });
      
      if (response.token && response.user) {
        await this.saveAuth(response.token, response.user);
        return { success: true, user: response.user };
      }
      
      throw new Error('Invalid login response');
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || '로그인에 실패했습니다.',
      };
    }
  }

  async logout() {
    await this.clearAuth();
    this.notify();
  }

  async saveAuth(token, user) {
    try {
      await Promise.all([
        SecureStore.setItemAsync('authToken', token),
        SecureStore.setItemAsync('userId', user.id),
        SecureStore.setItemAsync('email', user.email || ''),
      ]);
      
      this.token = token;
      this.user = user;
      this.notify();
    } catch (error) {
      console.error('Failed to save auth:', error);
      throw error;
    }
  }

  async clearAuth() {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync('authToken'),
        SecureStore.deleteItemAsync('userId'),
        SecureStore.deleteItemAsync('email'),
      ]);
    } catch (error) {
      console.error('Failed to clear auth:', error);
    }
    
    this.token = null;
    this.user = null;
  }

  async refreshUser() {
    if (!this.user?.id) return;
    
    try {
      const userData = await apiClient.getUser(this.user.id);
      this.user = userData;
      this.notify();
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }
}

export default new AuthStore();