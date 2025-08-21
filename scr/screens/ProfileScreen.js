// tokfriends-app/src/screens/ProfileScreen.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말로 로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '로그아웃', onPress: logout, style: 'destructive' },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>TokFriends</Text>
      <Text style={styles.subtitle}>프로필</Text>

      <View style={styles.profileCard}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>ID:</Text>
          <Text style={styles.value}>{user?.id || '-'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>이메일:</Text>
          <Text style={styles.value}>{user?.email || '-'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>닉네임:</Text>
          <Text style={styles.value}>{user?.displayName || '미설정'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  title: {
    fontSize: 24,
    fontFamily: 'NotoSansKR_700Bold',
    color: '#10B981',
    textAlign: 'center',
    paddingTop: 15,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'NotoSansKR_500Medium',
    color: '#fff',
    textAlign: 'center',
    paddingBottom: 15,
  },
  profileCard: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 20,
    margin: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  label: {
    fontSize: 14,
    fontFamily: 'NotoSansKR_400Regular',
    color: '#9CA3AF',
  },
  value: {
    fontSize: 14,
    fontFamily: 'NotoSansKR_500Medium',
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    padding: 15,
    margin: 15,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'NotoSansKR_500Medium',
    color: '#fff',
  },
});