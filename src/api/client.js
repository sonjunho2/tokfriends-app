// src/api/client.js
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 
                    Constants.manifest?.extra?.apiBaseUrl || 
                    'http://localhost:8000';

class ApiClient {
 constructor() {
   this.baseURL = API_BASE_URL;
 }

 async getAuthToken() {
   try {
     return await SecureStore.getItemAsync('authToken');
   } catch (error) {
     console.error('Failed to get auth token:', error);
     return null;
   }
 }

 async apiFetch(endpoint, options = {}) {
   const url = `${this.baseURL}${endpoint}`;
   const token = await this.getAuthToken();
   
   const headers = {
     'Content-Type': 'application/json',
     Accept: 'application/json',
     ...options.headers,
   };
   
   if (token && !options.skipAuth) {
     headers.Authorization = `Bearer ${token}`;
   }
   
   try {
     const response = await fetch(url, {
       ...options,
       headers,
       body: options.body ? JSON.stringify(options.body) : undefined,
     });
     
     const data = await response.json();
     
     if (!response.ok) {
       throw {
         status: response.status,
         message: data.message || 'Request failed',
         data,
       };
     }
     
     return data;
   } catch (error) {
     if (error.status === 401) {
       // Token expired or invalid
       await SecureStore.deleteItemAsync('authToken');
       await SecureStore.deleteItemAsync('userId');
       await SecureStore.deleteItemAsync('email');
     }
     throw error;
   }
 }

 // Auth endpoints
 async signup({ email, password, displayName, gender, dob }) {
   return this.apiFetch('/auth/signup/email', {
     method: 'POST',
     body: { email, password, displayName, gender, dob },
     skipAuth: true,
   });
 }

 async login({ email, password }) {
   return this.apiFetch('/auth/login/email', {
     method: 'POST',
     body: { email, password },
     skipAuth: true,
   });
 }

 // User endpoints
 async getUser(userId) {
   return this.apiFetch(`/users/${userId}`, {
     method: 'GET',
   });
 }

 async getMe() {
   const userId = await SecureStore.getItemAsync('userId');
   if (!userId) throw new Error('No user ID found');
   return this.getUser(userId);
 }

 // Topics endpoints
 async getTopics() {
   return this.apiFetch('/topics', {
     method: 'GET',
     skipAuth: true,
   });
 }

 async getTopicPosts(topicId, cursor = null, take = 20) {
   const params = new URLSearchParams();
   if (cursor) params.append('cursor', cursor);
   params.append('take', take.toString());
   
   return this.apiFetch(`/topics/${topicId}/posts?${params}`, {
     method: 'GET',
     skipAuth: true,
   });
 }

 // Posts endpoints
 async getPosts(params = {}) {
   const queryParams = new URLSearchParams();
   if (params.cursor) queryParams.append('cursor', params.cursor);
   if (params.take) queryParams.append('take', params.take.toString());
   if (params.topicId) queryParams.append('topicId', params.topicId);
   
   const query = queryParams.toString();
   return this.apiFetch(`/posts${query ? `?${query}` : ''}`, {
     method: 'GET',
     skipAuth: true,
   });
 }

 async createPost({ topicId, content }) {
   return this.apiFetch('/posts', {
     method: 'POST',
     body: { topicId, content },
   });
 }

 // Community endpoints
 async report({ targetUserId, postId, reason }) {
   return this.apiFetch('/community/report', {
     method: 'POST',
     body: { targetUserId, postId, reason },
   });
 }

 async block({ blockedUserId }) {
   return this.apiFetch('/community/block', {
     method: 'POST',
     body: { blockedUserId },
   });
 }
}

export default new ApiClient();