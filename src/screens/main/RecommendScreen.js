// src/screens/main/RecommendScreen.js
import React, { useState } from 'react';
import {
 View,
 Text,
 StyleSheet,
 SafeAreaView,
 TouchableOpacity,
 Dimensions,
 ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import HeaderLogo from '../../components/HeaderLogo';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';
import Tag from '../../components/Tag';
import colors from '../../theme/colors';

const { width, height } = Dimensions.get('window');

// 더미 추천 데이터
const DUMMY_RECOMMENDATIONS = [
 {
   id: '1',
   name: '유나',
   age: 25,
   location: '서울 강남구',
   bio: '평일엔 개발자, 주말엔 여행러 ✈️\n새로운 사람들과 대화하는 걸 좋아해요!',
   interests: ['여행', '카페', '코딩', '영화'],
   matchScore: 92,
   gender: 'female',
 },
 {
   id: '2',
   name: '태현',
   age: 28,
   location: '서울 성동구',
   bio: '운동과 음악을 사랑하는 긍정맨 💪\n함께 런닝하실 분 찾아요!',
   interests: ['헬스', '러닝', '음악', '요리'],
   matchScore: 88,
   gender: 'male',
 },
 {
   id: '3',
   name: '소연',
   age: 26,
   location: '서울 마포구',
   bio: '책과 커피가 있으면 행복한 사람 📚\n독서모임 같이 해요!',
   interests: ['독서', '글쓰기', '카페', '전시회'],
   matchScore: 85,
   gender: 'female',
 },
 {
   id: '4',
   name: '민호',
   age: 30,
   location: '서울 송파구',
   bio: '맛집 탐방과 사진 찍기를 좋아해요 📸\n주말 나들이 친구 구해요!',
   interests: ['사진', '맛집', '드라이브', '캠핑'],
   matchScore: 90,
   gender: 'male',
 },
 {
   id: '5',
   name: '은지',
   age: 24,
   location: '서울 서초구',
   bio: '게임과 애니메이션을 좋아하는 덕후 🎮\n취미 공유할 친구 찾아요!',
   interests: ['게임', '애니', '그림', 'K-POP'],
   matchScore: 87,
   gender: 'female',
 },
];

export default function RecommendScreen({ navigation }) {
 const [currentIndex, setCurrentIndex] = useState(0);
 const [likedUsers, setLikedUsers] = useState([]);
 const currentUser = DUMMY_RECOMMENDATIONS[currentIndex];

 const handleLike = () => {
   if (currentUser) {
     setLikedUsers([...likedUsers, currentUser.id]);
     goNext();
   }
 };

 const handlePass = () => {
   goNext();
 };

 const goNext = () => {
   if (currentIndex < DUMMY_RECOMMENDATIONS.length - 1) {
     setCurrentIndex(currentIndex + 1);
   } else {
     setCurrentIndex(0); // 순환
   }
 };

 const goPrevious = () => {
   if (currentIndex > 0) {
     setCurrentIndex(currentIndex - 1);
   } else {
     setCurrentIndex(DUMMY_RECOMMENDATIONS.length - 1); // 순환
   }
 };

 if (!currentUser) {
   return (
     <SafeAreaView style={styles.container}>
       <View style={styles.emptyContainer}>
         <Text style={styles.emptyText}>추천할 친구가 없습니다</Text>
       </View>
     </SafeAreaView>
   );
 }

 return (
   <SafeAreaView style={styles.container}>
     <View style={styles.header}>
       <HeaderLogo size="small" />
       <View style={styles.headerRight}>
         <Tag 
           label={`${currentIndex + 1}/${DUMMY_RECOMMENDATIONS.length}`}
           size="small"
           color="neutral"
         />
       </View>
     </View>

     <ScrollView 
       style={styles.content}
       showsVerticalScrollIndicator={false}
       contentContainerStyle={styles.scrollContent}
     >
       <View style={styles.cardContainer}>
         <TouchableOpacity 
           style={styles.navButton}
           onPress={goPrevious}
           activeOpacity={0.7}
         >
           <Ionicons name="chevron-back" size={24} color={colors.textTertiary} />
         </TouchableOpacity>

         <Card style={styles.recommendCard}>
           <LinearGradient
             colors={[colors.primary + '05', 'transparent']}
             style={styles.cardGradient}
           >
             <View style={styles.matchBadge}>
               <Text style={styles.matchText}>{currentUser.matchScore}%</Text>
               <Text style={styles.matchLabel}>매칭률</Text>
             </View>

             <Avatar
               name={currentUser.name}
               size="xlarge"
               style={styles.avatar}
             />

             <View style={styles.userInfo}>
               <Text style={styles.userName}>
                 {currentUser.name}, {currentUser.age}
               </Text>
               <View style={styles.locationRow}>
                 <Ionicons name="location" size={16} color={colors.textSecondary} />
                 <Text style={styles.location}>{currentUser.location}</Text>
               </View>
             </View>

             <Text style={styles.bio}>{currentUser.bio}</Text>

             <View style={styles.interestsContainer}>
               {currentUser.interests.map((interest, index) => (
                 <Tag
                   key={index}
                   label={interest}
                   size="small"
                   color={index % 2 === 0 ? 'primary' : 'mint'}
                   style={styles.interestTag}
                 />
               ))}
             </View>
           </LinearGradient>
         </Card>

         <TouchableOpacity 
           style={styles.navButton}
           onPress={goNext}
           activeOpacity={0.7}
         >
           <Ionicons name="chevron-forward" size={24} color={colors.textTertiary} />
         </TouchableOpacity>
       </View>

       <View style={styles.progressContainer}>
         {DUMMY_RECOMMENDATIONS.map((_, index) => (
           <View
             key={index}
             style={[
               styles.progressDot,
               index === currentIndex && styles.progressDotActive,
               likedUsers.includes(DUMMY_RECOMMENDATIONS[index].id) && styles.progressDotLiked,
             ]}
           />
         ))}
       </View>
     </ScrollView>

     <View style={styles.actionContainer}>
       <TouchableOpacity 
         style={styles.actionButton}
         onPress={handlePass}
         activeOpacity={0.7}
       >
         <View style={[styles.actionCircle, styles.passCircle]}>
           <Ionicons name="close" size={32} color={colors.error} />
         </View>
         <Text style={styles.actionText}>패스</Text>
       </TouchableOpacity>

       <TouchableOpacity 
         style={styles.superLikeButton}
         activeOpacity={0.7}
       >
         <LinearGradient
           colors={colors.gradients.mint}
           style={styles.superLikeCircle}
         >
           <Ionicons name="star" size={28} color={colors.textInverse} />
         </LinearGradient>
         <Text style={styles.actionText}>슈퍼</Text>
       </TouchableOpacity>

       <TouchableOpacity 
         style={styles.actionButton}
         onPress={handleLike}
         activeOpacity={0.7}
       >
         <View style={[styles.actionCircle, styles.likeCircle]}>
           <Ionicons name="heart" size={32} color={colors.primary} />
         </View>
         <Text style={styles.actionText}>좋아요</Text>
       </TouchableOpacity>
     </View>
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
 headerRight: {
   flexDirection: 'row',
   alignItems: 'center',
 },
 content: {
   flex: 1,
 },
 scrollContent: {
   paddingBottom: 20,
 },
 cardContainer: {
   flexDirection: 'row',
   alignItems: 'center',
   paddingHorizontal: 20,
   paddingTop: 20,
 },
 navButton: {
   padding: 8,
 },
 recommendCard: {
   flex: 1,
   marginHorizontal: 8,
   minHeight: height * 0.55,
 },
 cardGradient: {
   flex: 1,
   alignItems: 'center',
   padding: 24,
 },
 matchBadge: {
   position: 'absolute',
   top: 20,
   right: 20,
   backgroundColor: colors.primary,
   paddingHorizontal: 12,
   paddingVertical: 8,
   borderRadius: 20,
   alignItems: 'center',
 },
 matchText: {
   fontSize: 16,
   fontWeight: '700',
   color: colors.textInverse,
 },
 matchLabel: {
   fontSize: 10,
   color: colors.textInverse,
   opacity: 0.9,
   marginTop: 2,
 },
 avatar: {
   marginBottom: 20,
 },
 userInfo: {
   alignItems: 'center',
   marginBottom: 20,
 },
 userName: {
   fontSize: 24,
   fontWeight: '700',
   color: colors.text,
   marginBottom: 8,
 },
 locationRow: {
   flexDirection: 'row',
   alignItems: 'center',
 },
 location: {
   fontSize: 14,
   color: colors.textSecondary,
   marginLeft: 4,
 },
 bio: {
   fontSize: 15,
   color: colors.text,
   textAlign: 'center',
   lineHeight: 22,
   marginBottom: 20,
   paddingHorizontal: 10,
 },
 interestsContainer: {
   flexDirection: 'row',
   flexWrap: 'wrap',
   justifyContent: 'center',
   gap: 8,
 },
 interestTag: {
   marginBottom: 0,
 },
 progressContainer: {
   flexDirection: 'row',
   justifyContent: 'center',
   alignItems: 'center',
   paddingVertical: 20,
   gap: 8,
 },
 progressDot: {
   width: 8,
   height: 8,
   borderRadius: 4,
   backgroundColor: colors.borderLight,
 },
 progressDotActive: {
   width: 24,
   backgroundColor: colors.primary,
 },
 progressDotLiked: {
   backgroundColor: colors.success,
 },
 actionContainer: {
   flexDirection: 'row',
   justifyContent: 'center',
   alignItems: 'center',
   paddingVertical: 20,
   paddingHorizontal: 40,
   backgroundColor: colors.backgroundSecondary,
   borderTopWidth: 1,
   borderTopColor: colors.border,
   gap: 32,
 },
 actionButton: {
   alignItems: 'center',
 },
 superLikeButton: {
   alignItems: 'center',
 },
 actionCircle: {
   width: 64,
   height: 64,
   borderRadius: 32,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: colors.backgroundSecondary,
   borderWidth: 2,
   marginBottom: 4,
 },
 passCircle: {
   borderColor: colors.error,
 },
 likeCircle: {
   borderColor: colors.primary,
 },
 superLikeCircle: {
   width: 56,
   height: 56,
   borderRadius: 28,
   justifyContent: 'center',
   alignItems: 'center',
   marginBottom: 4,
 },
 actionText: {
   fontSize: 12,
   color: colors.textSecondary,
   fontWeight: '500',
 },
 emptyContainer: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
 },
 emptyText: {
   fontSize: 16,
   color: colors.textSecondary,
 },
});