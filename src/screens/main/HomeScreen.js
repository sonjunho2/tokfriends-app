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

  // 필터 알약 목록 (요청하신 순서)
  const FILTERS = [
    { key: 'hot', label: 'HOT추천', icon: 'flame' },
    { key: 'online', label: '접속중', icon: 'person' },
    { key: 'nearby', label: '가까운', icon: 'location' },
    { key: '20s', label: '20대', icon: 'sparkles' },
    { key: '30s', label: '30대', icon: 'sparkles' },
    { key: '40plus', label: '40대이상', icon: 'sparkles' },
    { key: 'opposite', label: '이성친구', icon: 'people' },
    { key: 'quick', label: '즉석만남', icon: 'flash' },
  ];

  const GRADIENT =
    colors?.gradients?.sunset ??
    [colors?.primary || '#F36C93', colors?.primaryLight || '#FFD2DE'];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.getActiveAnnouncements().catch(() => []);
      setAnnouncements(Array.isArray(res) ? res : []);
    } catch (e) {
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

  // 필터 클릭 라우팅 (간단 매핑)
  const onPressFilter = (key) => {
    switch (key) {
      case 'hot':
        return navigation.navigate('Recommend', { filter: 'hot' });
      case 'online':
        return navigation.navigate('LiveNow', { filter: 'online' });
      case 'nearby':
        return navigation.navigate('Nearby');
      case '20s':
        return navigation.navigate('Recommend', { ageRange: '20-29' });
      case '30s':
        return navigation.navigate('Recommend', { ageRange: '30-39' });
      case '40plus':
        return navigation.navigate('Recommend', { ageMin: 40 });
      case 'opposite':
        return navigation.navigate('Recommend', { type: 'opposite' });
      case 'quick':
        return navigation.navigate('Recommend', { type: 'quick' });
      default:
        return;
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

        {/* 🔹 필터 알약 영역 (요청 목록) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsRow}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={styles.pill}
              activeOpacity={0.9}
              onPress={() => onPressFilter(f.key)}
            >
              <Ionicons
                name={f.icon}
                size={16}
                color={colors.primary}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.pillText}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

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

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
  profileButton: { padding: 4 },
  scrollContent: { paddingTop: 20 },

  // welcome
  welcomeCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 140,
  },
  welcomeContent: { flex: 1 },
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
  welcomeIcon: { marginLeft: 16 },

  // pills
  pillsRow: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 10,
    marginBottom: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.border || '#E4E7EC',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text || '#111827',
  },

  // announcements
  section: { marginHorizontal: 20, marginBottom: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  announcementsList: { paddingRight: 20 },
  announcementCard: {
    width: 280,
    marginRight: 16,
    padding: 16,
    borderRadius: 16,
  },
  announcementHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  announcementTitle: {
    fontSize: 16, fontWeight: '600', color: colors.text, marginLeft: 8, flex: 1,
  },
  announcementContent: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: 8 },
  announcementDate: { fontSize: 12, color: colors.textTertiary },

  // info
  infoCard: { marginHorizontal: 20, marginBottom: 20, borderRadius: 20, padding: 20 },
  infoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  infoTitle: { fontSize: 18, fontWeight: '600', color: colors.text, marginLeft: 8 },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  infoLabel: { fontSize: 14, color: colors.textSecondary },
  infoValue: { fontSize: 14, fontWeight: '500', color: colors.text },
  fetchButton: { marginTop: 20 },

  bottomSpacing: { height: 20 },
});
