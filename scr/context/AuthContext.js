// tokfriends-app/src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:8000';

const AuthContext = createContext({
 user: null,
 token: null,
 initializing: true,
 login: async () => {},
 signup: async () => {},
 logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
 const [user, setUser] = useState(null);
 const [token, setToken] = useState(null);
 const [initializing, setInitializing] = useState(true);

 useEffect(() => {
   loadStoredAuth();
 }, []);

 const loadStoredAuth = async () => {
   try {
     const storedToken = await SecureStore.getItemAsync('auth_token');
     if (storedToken) {
       setToken(storedToken);
       const response = await axios.get(`${API_BASE_URL}/users/me`, {
         headers: { Authorization: `Bearer ${storedToken}` }
       });
       setUser(response.data);
     }
   } catch (error) {
     await SecureStore.deleteItemAsync('auth_token');
   } finally {
     setInitializing(false);
   }
 };

 const login = async (email, password) => {
   try {
     const response = await axios.post(`${API_BASE_URL}/auth/login/email`, {
       email,
       password
     });
     const { user: userData, token: authToken } = response.data;
     
     await SecureStore.setItemAsync('auth_token', authToken);
     setToken(authToken);
     setUser(userData);
     
     return { success: true };
   } catch (error) {
     Alert.alert('로그인 실패', error.response?.data?.message || '로그인에 실패했습니다.');
     return { success: false };
   }
 };

 const signup = async (signupData) => {
   try {
     const response = await axios.post(`${API_BASE_URL}/auth/signup/email`, signupData);
     const { user: userData, token: authToken } = response.data;
     
     await SecureStore.setItemAsync('auth_token', authToken);
     setToken(authToken);
     setUser(userData);
     
     return { success: true };
   } catch (error) {
     Alert.alert('회원가입 실패', error.response?.data?.message || '회원가입에 실패했습니다.');
     return { success: false };
   }
 };

 const logout = async () => {
   try {
     await SecureStore.deleteItemAsync('auth_token');
     setToken(null);
     setUser(null);
   } catch (error) {
     Alert.alert('오류', '로그아웃 중 문제가 발생했습니다.');
   }
 };

 return (
   <AuthContext.Provider value={{
     user,
     token,
     initializing,
     login,
     signup,
     logout
   }}>
     {children}
   </AuthContext.Provider>
 );
};