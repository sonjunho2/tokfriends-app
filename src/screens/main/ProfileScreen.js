// src/screens/main/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import HeaderLogo from '../../components/HeaderLogo';
import ButtonPrimary from '../../components/ButtonPrimary';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';
import Tag from '../../components/Tag';
import colors from '../../theme/colors';
import authStore from '../../store/auth';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(authStore.user);
  const [showRawData, setShowRawData] = useState(false);

  useEffect(() => {
    const unsubscribe = authStore.subscribe((state) => {
      setUser(state.user);
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '로그아웃', 
          style: 'destructive',
          onPress: () => authStore.logout()
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>프로필</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileHeader}
        >
          <Avatar
            name={user?.displayName || user?.email}
            size="xlarge"
            showBorder
            style={styles.avatar}
          />
          <Text style={styles.displayName}>
            {user?.displayName || '친구'}
          </Text>
          <Text style={styles.email}>
            {user?.email || '-'}
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>친구</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>채팅</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>새싹</Text>
              <Text style={styles.statLabel}>레벨</Text>
            </View>
          </View>
        </LinearGradient>

        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>계정 정보</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>이메일</Text>
            </View>
            <Text style={styles.infoValue}>{user?.email || '-'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>닉네임</Text>
            </View>
            <Text style={styles.infoValue}>{user?.displayName || '-'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="key-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>계정 ID</Text>
            </View>
            <Text style={styles.infoValueSmall}>{user?.id || '-'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>가입일</Text>
            </View>
            <Text style={styles.infoValue}>{formatDate(user?.createdAt)}</Text>
          </View>
        </Card>

        <Card style={styles.debugCard}>
          <TouchableOpacity
            style={styles.debugHeader}
            onPress={() => setShowRawData(!showRawData)}
          >
            <View style={styles.debugLeft}>
              <Ionicons name="code" size={20} color={colors.accentMint} />
              <Text style={styles.debugTitle}>개발자 정보</Text>
            </View>
            <Ionicons 
              name={showRawData ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
          
          {showRawData && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.rawDataScroll}
            >
              <Text style={styles.rawData}>
                {JSON.stringify(user, null, 2)}
              </Text>
            </ScrollView>
          )}
        </Card>

        <View style={styles.actionButtons}>
          <ButtonPrimary
            title="프로필 편집"
            onPress={() => Alert.alert('준비중', '프로필 편집 기능을 준비중입니다.')}
            variant="solid"
            style={styles.editButton}
          />
          
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  settingsButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  avatar: {
    marginBottom: 16,
    borderWidth: 4,
    borderColor: colors.backgroundSecondary,
  },
  displayName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textInverse,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.textInverse,
    opacity: 0.9,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  infoCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  infoValueSmall: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: colors.text,
  },
  debugCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
  },
  debugHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  debugLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  rawDataScroll: {
    marginTop: 16,
    maxHeight: 200,
  },
  rawData: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: colors.textSecondary,
    lineHeight: 16,
  },
  actionButtons: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  editButton: {
    marginBottom: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 20,
  },
});
