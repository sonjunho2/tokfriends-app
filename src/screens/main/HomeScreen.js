// src/screens/main/HomeScreen.js (수정된 부분만)
import React, { useState, useEffect } from 'react';
// ... 다른 imports
import { useAuth } from '../../context/AuthContext'; // authStore 대신 useAuth

export default function HomeScreen({ navigation }) {
  const { user, refreshMe } = useAuth(); // useAuth 사용
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    if (!user?.id) {
      Alert.alert('알림', '로그인 정보가 없습니다.');
      return;
    }

    setLoading(true);
    try {
      // apiClient 대신 http 사용
      const response = await http.get(`/users/${user.id}`);
      setUserData(response.data);
      Alert.alert('성공', '사용자 정보를 불러왔습니다.');
    } catch (error) {
      Alert.alert('오류', '정보를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshMe();
    setRefreshing(false);
  };

  // ... 나머지 코드는 동일
