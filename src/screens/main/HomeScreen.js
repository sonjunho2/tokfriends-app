// src/screens/main/HomeScreen.js
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
import apiClient from '../../api/client';

export default function HomeScreen({ navigation }) {
 const [user, setUser] = useState(authStore.user);
 const [loading, setLoading] = useState(false);
 const [refreshing, setRefreshing] = useState(false);
 const [userData, setUserData] = useState(null);

 useEffect(() => {
   const unsubscribe = authStore.subscribe((state) => {
     setUser(state.user);
   });
   return unsubscribe;
 }, []);

 const fetchUserData = async () => {
   if (!user?.id) {
     Alert.alert('알림', '로그인 정보가 없습니다.');
     return;
   }

   setLoading(true);
   try {
     const data = await apiClient.getUser(user.id);
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
   await authStore.refreshUser();
   setRefreshing(false);
 };

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
       <LinearGradient
         colors={colors.gradients.sunset}
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
           <Ionicons name="sparkles" size={60} color={colors.textInverse} />
         </View>
       </LinearGradient>

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
           icon={<Ionicons name="refresh" size={20} color={colors.textInverse} />}
           style={styles.fetchButton}
         />
       </Card>

       {userData && (
         <Card style={styles.dataCard}>
           <View style={styles.dataHeader}>
             <Ionicons name="code" size={20} color={colors.accentMint} />
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
             <View style={[styles.actionIcon, { backgroundColor: colors.primary + '15' }]}>
               <Ionicons name="pulse" size={28} color={colors.primary} />
             </View>
             <Text style={styles.actionText}>실시간</Text>
           </TouchableOpacity>
           
           <TouchableOpacity 
             style={styles.actionItem}
             onPress={() => navigation.navigate('Nearby')}
           >
             <View style={[styles.actionIcon, { backgroundColor: colors.accentMint + '15' }]}>
               <Ionicons name="location" size={28} color={colors.accentMint} />
             </View>
             <Text style={styles.actionText}>내주변</Text>
           </TouchableOpacity>
           
           <TouchableOpacity 
             style={styles.actionItem}
             onPress={() => navigation.navigate('Recommend')}
           >
             <View style={[styles.actionIcon, { backgroundColor: colors.primary + '15' }]}>
               <Ionicons name="heart" size={28} color={colors.primary} />
             </View>
             <Text style={styles.actionText}>추천</Text>
           </TouchableOpacity>
           
           <TouchableOpacity 
             style={styles.actionItem}
             onPress={() => navigation.navigate('Chats')}
           >
             <View style={[styles.actionIcon, { backgroundColor: colors.accentMint + '15' }]}>
               <Ionicons name="chatbubbles" size={28} color={colors.accentMint} />
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
   color: colors.textInverse,
   opacity: 0.9,
   marginBottom: 4,
 },
 welcomeName: {
   fontSize: 24,
   fontWeight: '700',
   color: colors.textInverse,
   marginBottom: 8,
 },
 welcomeSubtext: {
   fontSize: 14,
   color: colors.textInverse,
   opacity: 0.8,
 },
 welcomeIcon: {
   marginLeft: 16,
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
 sectionTitle: {
   fontSize: 18,
   fontWeight: '600',
   color: colors.text,
   marginBottom: 16,
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