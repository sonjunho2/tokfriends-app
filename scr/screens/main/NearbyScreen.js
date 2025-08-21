// src/screens/main/NearbyScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import HeaderLogo from '../../components/HeaderLogo';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';
import Tag from '../../components/Tag';
import colors from '../../theme/colors';

// 더미 데이터
const DUMMY_NEARBY = [
  {
    id: '1',
    name: '지은',
    age: 26,
    distance: 230,
    location: '강남역',
    bio: '카페 투어 좋아해요 ☕',
    interests: ['카페', '영화', '산책'],
    imageUrl: null,
    gender: 'female',
  },
  {
    id: '2',
    name: '성민',
    age: 29,
    distance: 450,
    location: '선릉역',
    bio: '운동 파트너 찾아요 💪',
    interests: ['헬스', '러닝', '등산'],
    imageUrl: null,
    gender: 'male',
  },
  {
    id: '3',
    name: '하늘',
    age: 24,
    distance: 680,
    location: '역삼동',
    bio: '맛집 탐방러입니다 🍜',
    interests: ['맛집', '요리', '여행'],
    imageUrl: null,
    gender: 'female',
  },
  {
    id: '4',
    name: '준혁',
    age: 31,
    distance: 1200,
    location: '삼성동',
    bio: '책 읽고 대화하는 걸 좋아해요',
    interests: ['독서', '영화', '음악'],
    imageUrl: null,
    gender: 'male',
  },
  {
    id: '5',
    name: '수빈',
    age: 27,
    distance: 1800,
    location: '청담동',
    bio: '새로운 친구 만나고 싶어요 😊',
    interests: ['쇼핑', '카페', 'K-POP'],
    imageUrl: null,
    gender: 'female',
  },
];

export default function NearbyScreen({ navigation }) {
  const [nearbyUsers, setNearbyUsers] = useState(DUMMY_NEARBY);
  const [refreshing, setRefreshing] = useState(false);

  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      // 거리 랜덤하게 변경
      const updated = nearbyUsers.map(user => ({
        ...user,
        distance: Math.floor(Math.random() * 2000) + 100,
      }));
      setNearbyUsers(updated.sort((a, b) => a.distance - b.distance));
      setRefreshing(false);
    }, 1000);
  };

  const renderNearbyUser = ({ item }) => (
    <Card
      style={styles.userCard}
      onPress={() => navigation.navigate('ChatRoom', { user: item })}
      padding={0}
    >
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.userImage} />
          ) : (
            <View style={styles.avatarContainer}>
              <Avatar name={item.name} size={80} />
            </View>
          )}
          <View style={styles.distancePill}>
            <Ionicons name="location" size={12} color={colors.textInverse} />
            <Text style={styles.distanceText}>{formatDistance(item.distance)}</Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <View style={styles.userHeader}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userAge}>{item.age}세</Text>
          </View>

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={colors.textTertiary} />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>

          <Text style={styles.userBio} numberOfLines={2}>
            {item.bio}
          </Text>

          <View style={styles.interestsContainer}>
            {item.interests.slice(0, 3).map((interest, index) => (
              <Tag
                key={index}
                label={interest}
                size="tiny"
                color={index === 0 ? 'primary' : 'neutral'}
                style={styles.interestTag}
              />
            ))}
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <HeaderLogo size="small" />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <LinearGradient
        colors={[colors.accentMint + '10', 'transparent']}
        style={styles.gradientBanner}
      >
        <View style={styles.bannerContent}>
          <View>
            <Text style={styles.bannerTitle}>내 주변 친구들</Text>
            <Text style={styles.bannerSubtitle}>
              가까운 거리의 친구들과 만나보세요
            </Text>
          </View>
          <View style={styles.rangeIndicator}>
            <Ionicons name="radio-outline" size={20} color={colors.accentMint} />
            <Text style={styles.rangeText}>2km</Text>
          </View>
        </View>
      </LinearGradient>

      <FlatList
        data={nearbyUsers}
        renderItem={renderNearbyUser}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accentMint}
          />
        }
      />
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
  filterButton: {
    padding: 4,
  },
  gradientBanner: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  rangeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentMint + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  rangeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accentMint,
    marginLeft: 4,
  },
  listContent: {
    padding: 16,
  },
  userCard: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  leftSection: {
    position: 'relative',
    marginRight: 16,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.backgroundTertiary,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  distancePill: {
    position: 'absolute',
    bottom: -4,
    left: '50%',
    marginLeft: -30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentMint,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textInverse,
    marginLeft: 3,
  },
  rightSection: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  userAge: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 13,
    color: colors.textTertiary,
    marginLeft: 4,
  },
  userBio: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  interestTag: {
    marginRight: 0,
  },
});