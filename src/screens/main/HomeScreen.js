import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
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

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [announcementsData] = await Promise.all([
        apiClient.getActiveAnnouncements(),
      ]);
      setAnnouncements(Array.isArray(announcementsData?.data) ? announcementsData.data : []);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    if (!user?.id) {
      Alert.alert('알림', '로그인 정보가 없습니다.');
      return;
    }

    setLoading(true);
    try {
      const data = await apiClient.getMe();
      setUserData(data);
      Alert.alert('성공', '사용자 정보를 불러왔습니다.');
    } catch (error) {
      Alert.alert('오류', '정보를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refreshMe(),
      loadInitialData(),
    ]);
    setRefreshing(false);
  };

  const renderAnnouncement = ({ item }) => (
    <Card style={styles.announcementCard}>
      <View style={styles.announcementHeader}>
        <Ionicons name="megaphone" size={20} color={colors.primary} />
        <Text style={styles.announcementTitle}>{item.title}</Text>
      </View>
      <Text style={styles.announcementContent} numberOfLines={2}>
        {item.body}
      </Text>
      <Text style={styles.announcementDate}>
        {new Date(item.createdAt).toLocaleDateString('ko-KR')}
      </Text>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <HeaderLogo size="medium" />
        <TouchableOpacity 
          onPress={() => navigation.navigate('Profile')}
          style={styles.profileButton}
        >
          <Avatar
            name={user?.displayName || user?.email}
            size="small"
          />
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
        <Card style={styles.welcomeCard}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeText}>안녕하세요,</Text>
            <Text style={styles.welcomeName}>
              {user?.displayName || '친구'}님!
            </Text>
            <Text style={styles.welcomeSubtext}>
              오늘도 새로운 친구를 만나보세요
            </Text>
          </View>
          <View style={styles.welcomeIcon}>
            <Ionicons name="sparkles" size={48} color={colors.primary} />
          </View>
        </Card>

        {announcements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>공지사항</Text>
            <FlatList
              data={announcements}
              renderItem={renderAnnouncement}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.announcementsList}
            />
          </View>
        )}

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
            icon={<Ionicons name="refresh" size={18} color={colors.textInverse} />}
            style={styles.fetchButton}
          />
        </Card>

        {userData && (
          <Card style={styles.dataCard}>
            <View style={styles.dataHeader}>
              <Ionicons name="code" size={20} color={colors.primary} />
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

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>빠른 메뉴</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={styles.actionItem}
              onPress={() => navigation.navigate('LiveNow')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="pulse" size={28} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>실시간</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionItem}
              onPress={() => navigation.navigate('Nearby')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="location" size={28} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>내주변</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionItem}
              onPress={() => navigation.navigate('Recommend')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="heart" size={28} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>추천</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionItem}
              onPress={() => navigation.navigate('Chats')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="chatbubbles" size={28} color={colors.primary} />
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
    paddingHorizontal: 24,
    paddingVertical: 16,
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
    marginBottom: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary + '10',
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  welcomeName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  welcomeIcon: {
    marginLeft: 16,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
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
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  announcementContent: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  announcementDate: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 12,
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
    fontWeight: '600',
    color: colors.text,
  },
  fetchButton: {
    marginTop: 20,
  },
  dataCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
  },
  dataHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dataTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
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
   justifyContent: 'space-between',
 },
 actionItem: {
   width: '48%',
   alignItems: 'center',
   backgroundColor: colors.backgroundSecondary,
   padding: 20,
   borderRadius: 12,
   marginBottom: 12,
 },
 actionIcon: {
   width: 64,
   height: 64,
   borderRadius: 32,
   backgroundColor: colors.primary + '15',
   justifyContent: 'center',
   alignItems: 'center',
   marginBottom: 12,
 },
 actionText: {
   fontSize: 14,
   fontWeight: '600',
   color: colors.text,
 },
 bottomSpacing: {
   height: 20,
 },
});
