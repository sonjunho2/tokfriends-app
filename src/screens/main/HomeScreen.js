import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import HeaderLogo from '../../components/HeaderLogo';
import ButtonPrimary from '../../components/ButtonPrimary';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';
import colors from '../../theme/colors';
import animations from '../../theme/animations';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { user, refreshMe } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardAnimValues = useRef([]).current;

  useEffect(() => {
    loadInitialData();
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: animations.timing.slow,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
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

  const renderAnnouncement = ({ item, index }) => {
    if (!cardAnimValues[index]) {
      cardAnimValues[index] = new Animated.Value(0);
      Animated.timing(cardAnimValues[index], {
        toValue: 1,
        duration: animations.timing.slow,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }

    return (
      <Animated.View
        style={[
          styles.announcementWrapper,
          {
            opacity: cardAnimValues[index],
            transform: [{
              translateY: cardAnimValues[index].interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              })
            }],
          },
        ]}
      >
        <Card glass={true} glow={true} style={styles.announcementCard}>
          <LinearGradient
            colors={colors.gradients.glass}
            style={styles.announcementGradient}
          >
            <View style={styles.announcementHeader}>
              <View style={styles.announcementIcon}>
                <Ionicons name="megaphone" size={18} color={colors.primary} />
              </View>
              <Text style={styles.announcementTitle}>{item.title}</Text>
            </View>
            <Text style={styles.announcementContent} numberOfLines={2}>
              {item.body}
            </Text>
            <Text style={styles.announcementDate}>
              {new Date(item.createdAt).toLocaleDateString('ko-KR')}
            </Text>
          </LinearGradient>
        </Card>
      </Animated.View>
    );
  };

  const quickActions = [
    { 
      key: 'live', 
      name: 'LiveNow', 
      title: '실시간', 
      icon: 'pulse', 
      color: colors.primary,
      gradient: colors.gradients.primary 
    },
    { 
      key: 'nearby', 
      name: 'Nearby', 
      title: '내주변', 
      icon: 'location', 
      color: colors.accent,
      gradient: colors.gradients.accent 
    },
    { 
      key: 'recommend', 
      name: 'Recommend', 
      title: '추천', 
      icon: 'heart', 
      color: colors.secondary,
      gradient: colors.gradients.secondary 
    },
    { 
      key: 'chats', 
      name: 'Chats', 
      title: '채팅', 
      icon: 'chatbubbles', 
      color: colors.success,
      gradient: [colors.success, '#059669'] 
    },
  ];

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
            showGlow={true}
            gradient="primary"
            animated={true}
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
        <Animated.View
          style={[
            styles.welcomeSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Card gradient="cosmos" style={styles.welcomeCard} glow={true}>
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
              <Ionicons name="sparkles" size={48} color={colors.textInverse} />
            </View>
          </Card>
        </Animated.View>

        {announcements.length > 0 && (
          <Animated.View
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>공지사항</Text>
            <FlatList
              data={announcements}
              renderItem={renderAnnouncement}
              keyExtractor={(item) => item.id.toString()}
             horizontal
             showsHorizontalScrollIndicator={false}
             contentContainerStyle={styles.announcementsList}
           />
         </Animated.View>
       )}

       <Animated.View
         style={[
           styles.section,
           {
             opacity: fadeAnim,
             transform: [{ translateY: slideAnim }],
           },
         ]}
       >
         <Card glass={true} style={styles.infoCard}>
           <LinearGradient
             colors={colors.gradients.glass}
             style={styles.infoGradient}
           >
             <View style={styles.infoHeader}>
               <View style={styles.infoIconContainer}>
                 <Ionicons name="person-circle" size={24} color={colors.primary} />
               </View>
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
               size="medium"
               gradient="primary"
               glow={true}
               icon={<Ionicons name="refresh" size={18} color={colors.textInverse} />}
               style={styles.fetchButton}
             />
           </LinearGradient>
         </Card>
       </Animated.View>

       {userData && (
         <Animated.View
           style={[
             styles.section,
             {
               opacity: fadeAnim,
               transform: [{ translateY: slideAnim }],
             },
           ]}
         >
           <Card glass={true} style={styles.dataCard}>
             <View style={styles.dataHeader}>
               <Ionicons name="code" size={20} color={colors.accent} />
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
         </Animated.View>
       )}

       <Animated.View
         style={[
           styles.quickActionsSection,
           {
             opacity: fadeAnim,
             transform: [{ translateY: slideAnim }],
           },
         ]}
       >
         <Text style={styles.sectionTitle}>빠른 메뉴</Text>
         <View style={styles.actionGrid}>
           {quickActions.map((action, index) => {
             if (!cardAnimValues[`action_${index}`]) {
               cardAnimValues[`action_${index}`] = new Animated.Value(0);
               Animated.timing(cardAnimValues[`action_${index}`], {
                 toValue: 1,
                 duration: animations.timing.slow,
                 delay: (index + announcements.length) * 100,
                 useNativeDriver: true,
               }).start();
             }

             return (
               <Animated.View
                 key={action.key}
                 style={[
                   styles.actionItemWrapper,
                   {
                     opacity: cardAnimValues[`action_${index}`],
                     transform: [{
                       translateY: cardAnimValues[`action_${index}`].interpolate({
                         inputRange: [0, 1],
                         outputRange: [30, 0],
                       })
                     }],
                   },
                 ]}
               >
                 <Card
                   onPress={() => navigation.navigate(action.name)}
                   glass={true}
                   glow={true}
                   style={styles.actionItem}
                 >
                   <LinearGradient
                     colors={action.gradient}
                     style={styles.actionIcon}
                     start={{ x: 0, y: 0 }}
                     end={{ x: 1, y: 1 }}
                   >
                     <Ionicons name={action.icon} size={28} color={colors.textInverse} />
                   </LinearGradient>
                   <Text style={styles.actionText}>{action.title}</Text>
                 </Card>
               </Animated.View>
             );
           })}
         </View>
       </Animated.View>

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
   backgroundColor: colors.backgroundGlass,
   borderBottomWidth: 1,
   borderBottomColor: colors.border,
 },
 profileButton: {
   padding: 4,
 },
 scrollContent: {
   paddingTop: 24,
 },
 welcomeSection: {
   marginHorizontal: 24,
   marginBottom: 32,
 },
 welcomeCard: {
   padding: 28,
   minHeight: 140,
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'space-between',
 },
 welcomeContent: {
   flex: 1,
 },
 welcomeText: {
   fontSize: 16,
   color: colors.textInverse,
   opacity: 0.9,
   marginBottom: 4,
 },
 welcomeName: {
   fontSize: 28,
   fontWeight: '800',
   color: colors.textInverse,
   marginBottom: 8,
   letterSpacing: -0.5,
 },
 welcomeSubtext: {
   fontSize: 14,
   color: colors.textInverse,
   opacity: 0.8,
 },
 welcomeIcon: {
   marginLeft: 20,
 },
 section: {
   marginHorizontal: 24,
   marginBottom: 24,
 },
 sectionTitle: {
   fontSize: 20,
   fontWeight: '700',
   color: colors.text,
   marginBottom: 16,
   letterSpacing: -0.3,
 },
 announcementsList: {
   paddingRight: 24,
 },
 announcementWrapper: {
   marginRight: 16,
 },
 announcementCard: {
   width: 280,
   overflow: 'hidden',
 },
 announcementGradient: {
   padding: 20,
   borderRadius: 20,
 },
 announcementHeader: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 12,
 },
 announcementIcon: {
   width: 32,
   height: 32,
   borderRadius: 16,
   backgroundColor: colors.primaryGlow,
   justifyContent: 'center',
   alignItems: 'center',
   marginRight: 12,
 },
 announcementTitle: {
   fontSize: 16,
   fontWeight: '700',
   color: colors.text,
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
   fontWeight: '500',
 },
 infoCard: {
   overflow: 'hidden',
 },
 infoGradient: {
   padding: 24,
   borderRadius: 20,
 },
 infoHeader: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 20,
 },
 infoIconContainer: {
   width: 36,
   height: 36,
   borderRadius: 18,
   backgroundColor: colors.primaryGlow,
   justifyContent: 'center',
   alignItems: 'center',
   marginRight: 12,
 },
 infoTitle: {
   fontSize: 18,
   fontWeight: '700',
   color: colors.text,
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
   fontWeight: '500',
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
   padding: 20,
 },
 dataHeader: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 16,
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
   fontFamily: 'Courier',
   color: colors.textSecondary,
   lineHeight: 18,
 },
 quickActionsSection: {
   paddingHorizontal: 24,
   marginBottom: 32,
 },
 actionGrid: {
   flexDirection: 'row',
   flexWrap: 'wrap',
   justifyContent: 'space-between',
 },
 actionItemWrapper: {
   width: '48%',
   marginBottom: 16,
 },
 actionItem: {
   padding: 20,
   alignItems: 'center',
   justifyContent: 'center',
   minHeight: 120,
 },
 actionIcon: {
   width: 64,
   height: 64,
   borderRadius: 32,
   justifyContent: 'center',
   alignItems: 'center',
   marginBottom: 12,
   shadowColor: colors.shadowPrimary,
   shadowOffset: {
     width: 0,
     height: 4,
   },
   shadowOpacity: 0.3,
   shadowRadius: 8,
   elevation: 8,
 },
 actionText: {
   fontSize: 14,
   fontWeight: '700',
   color: colors.text,
 },
 bottomSpacing: {
   height: 40,
 },
});
