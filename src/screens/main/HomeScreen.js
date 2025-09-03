// src/screens/main/HomeScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import HeaderLogo from '../../components/HeaderLogo';
import ButtonPrimary from '../../components/ButtonPrimary';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';
import colors from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';

export default function HomeScreen({ navigation }) {
  const { user, refreshMe } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  // gradient 컬러 안전 기본값
  const GRADIENT =
    colors?.gradients?.sunset ??
    [colors?.primary || '#F36C93', colors?.primaryLight || '#FFD2DE'];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient
        .getActiveAnnouncements()
        .catch(() => []);
      // 배열 보장
      setAnnouncements(Array.isArray(res) ? res : []);
    } catch (e) {
      // 콘솔만 남기고 UI는 조용히 유지
      console.warn('[Home] loadInitialData error:', e?.message || e);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    if (!user?.id) {
      Alert.alert('알림', '로그인 정보가 없습니다.');
      return;
    }
    try {
      setLoading(true);
      const data = await apiClient.getMe();
      setUserData(data || {});
      Alert.alert('성공', '사용자 정보를 불러왔습니다.');
    } catch (error) {
      console.warn('[Home] getMe error:', error?.message || error);
      Alert.alert('오류', '정보를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refreshMe?.(), loadInitialData()]);
    } finally {
      setRefreshing(false);
    }
  };

  const renderAnnouncement = ({ item }) => (
    <Card style={styles.announcementCard}>
      <View style={styles.announcementHeader}>
        <Ionicons name="megaphone" size={20} color={colors.primary} />
        <Text style={styles.announcementTitle} numberOfLines={1}>
          {item?.title ?? '공지'}
        </Text>
      </View>
      <Text style={styles.announcementContent} numberOfLines={2}>
        {item?.content ?? ''}
      </Text>
      <Text style={styles.announcementDate}>
        {item?.createdAt
          ? new Date(item.createdAt).toLocaleDateString('ko-KR')
          : ''}
      </Text>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <HeaderLogo size="medium" />
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.profileButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Avatar name={user?.displayName || user?.email} size="small" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* 환영 카드 */}
        <LinearGradient
          colors={GRADIENT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.welcomeCard}
        >
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeText}>안녕하세요,</Text>
            <Text style={styles.welcomeName}>
              {user?.displayName || '친구'}님! 👋
            </Text>
            <Text style={styles.welcomeSubtext}>
              오늘도 새로운 친구를 만나보세요
            </Text>
          </View>
          <View style={styles.welcomeIcon}>
            <Ionicons
              name="sparkles"
              size={60}
              color={colors.textInverse || '#ffffff'}
            />
          </View>
        </LinearGradient>

        {/* 공지사항 */}
        {announcements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>공지사항</Text>
            <FlatList
              data={announcements}
              renderItem={renderAnnouncement}
              keyExtractor={(item, idx) =>
                item?.id != null ? String(item.id) : `a-${idx}`
              }
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.announcementsList}
            />
          </View>
        )}

        {/* 내 계정 정보 */}
        <Card style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="person-circle" size={24} color={colors.primary} />
            <Text style={styles.infoTitle}>내 계정 정보</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>이메일</Text>
            <Text style={styles.infoValue}>{user?.email || '-'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>닉네임</Text>
            <Text style={styles.infoValue}>{user?.displayName || '-'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>계정 ID</Text>
            <Text style={styles.infoValue}>{user?.id || '-'}</Text>
          </View>

          <ButtonPrimary
            title="내 정보 불러오기"
            onPress={fetchUserData}
            loading={loading}
            icon={
              <Ionicons
                name="refresh"
                size={20}
                color={colors.textInverse || '#ffffff'}
              />
            }
            style={styles.fetchButton}
          />
        </Card>

        {/* 서버 응답 데이터 미리보기 */}
        {userData && (
          <Card style={styles.dataCard}>
            <View style={styles.dataHeader}>
              <Ionicons
                name="code"
                size={20}
                color={colors.accentMint || colors.primary}
              />
              <Text style={styles.dataTitle}>서버 응답 데이터</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.dataScroll}
            >
              <Text style={styles.dataContent}>
                {JSON.stringify(userData, null, 2)}
              </Text>
            </ScrollView>
          </Card>
        )}

        {/* 빠른 메뉴 */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>빠른 메뉴</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => navigation.navigate('LiveNow')}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: (colors.primary || '#F36C93') + '15' },
                ]}
              >
                <Ionicons name="pulse" size={28} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>실시간</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => navigation.navigate('Nearby')}
            >
              <View
                style={[
                  styles.actionIcon,
                  {
                    backgroundColor:
                      (colors.accentMint || colors.primary || '#44D1A6') +
                      '15',
                  },
                ]}
              >
                <Ionicons
                  name="location"
                  size={28}
                  color={colors.accentMint || colors.primary}
                />
              </View>
              <Text style={styles.actionText}>내주변</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => navigation.navigate('Recommend')}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: (colors.primary || '#F36C93') + '15' },
                ]}
              >
                <Ionicons name="heart" size={28} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>추천</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => navigation.navigate('Chats')}
            >
              <View
                style={[
                  styles.actionIcon,
                  {
                    backgroundColor:
                      (colors.accentMint || colors.primary || '#44D1A6') +
                      '15',
                  },
                ]}
              >
                <Ionicons
                  name="chatbubbles"
                  size={28}
                  color={colors.accentMint || colors.primary}
                />
              </View>
              <Text style={styles.actionText}>채팅</Text>
            </TouchableOpacity>
          </View>
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
  profileButton: {
    padding: 4,
  },
  scrollContent: {
    paddingTop: 20,
  },
  welcomeCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 140,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.textInverse || '#ffffff',
    opacity: 0.9,
    marginBottom: 4,
  },
  welcomeName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textInverse || '#ffffff',
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: colors.textInverse || '#ffffff',
    opacity: 0.8,
  },
  welcomeIcon: {
    marginLeft: 16,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  announcementsList: {
    paddingRight: 20,
  },
  announcementCard: {
    width: 280,
    marginRight: 16,
    padding: 16,
    borderRadius: 16,
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  announcementContent: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  announcementDate: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  fetchButton: {
    marginTop: 20,
  },
  dataCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
  },
  dataHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dataTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 6,
  },
  dataScroll: {
    maxHeight: 200,
  },
  dataContent: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: colors.textSecondary,
    lineHeight: 18,
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionItem: {
    width: '47%',
    alignItems: 'center',
  },
  actionIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  bottomSpacing: {
    height: 20,
  },
});
