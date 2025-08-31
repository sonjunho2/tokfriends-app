import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HeaderLogo from '../../components/HeaderLogo';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';
import Tag from '../../components/Tag';
import colors from '../../theme/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 64) / 2;

const DUMMY_USERS = [
  { id: '1', name: '서연', city: '서울', age: 25, gender: 'female', online: true },
  { id: '2', name: '민준', city: '강남', age: 28, gender: 'male', online: true },
  { id: '3', name: '지민', city: '판교', age: 23, gender: 'female', online: true },
  { id: '4', name: '현우', city: '성남', age: 30, gender: 'male', online: true },
  { id: '5', name: '수아', city: '분당', age: 26, gender: 'female', online: true },
  { id: '6', name: '준서', city: '용인', age: 27, gender: 'male', online: true },
  { id: '7', name: '하윤', city: '수원', age: 24, gender: 'female', online: true },
  { id: '8', name: '도윤', city: '안양', age: 29, gender: 'male', online: true },
];

export default function LiveNowScreen({ navigation }) {
  const [users, setUsers] = useState(DUMMY_USERS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      const shuffled = [...DUMMY_USERS].sort(() => Math.random() - 0.5);
      setUsers(shuffled);
      setRefreshing(false);
    }, 1000);
  };

  const renderUser = ({ item }) => (
    <Card
      style={styles.userCard}
      onPress={() => navigation.navigate('ChatRoom', { user: item })}
    >
      <View style={styles.onlineIndicator} />
      
      <Avatar
        name={item.name}
        size={64}
        online={true}
        style={styles.avatar}
      />
      
      <Text style={styles.userName}>{item.name}</Text>
      
      <View style={styles.userInfo}>
        <Ionicons 
          name="location-outline" 
          size={14} 
          color={colors.textTertiary} 
        />
        <Text style={styles.userCity}>{item.city}</Text>
        <Text style={styles.userAge}>{item.age}세</Text>
      </View>
      
      <Tag 
        label={item.gender === 'female' ? '여성' : '남성'}
        size="tiny"
        selected={false}
        style={styles.genderTag}
      />
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <HeaderLogo size="medium" />
        <View style={styles.onlineCount}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>{users.length}명 접속중</Text>
        </View>
      </View>

      <View style={styles.banner}>
        <Ionicons name="pulse" size={24} color={colors.primary} />
        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerTitle}>지금 접속중인 친구들</Text>
          <Text style={styles.bannerSubtitle}>
            실시간으로 대화를 나눌 수 있어요
          </Text>
        </View>
      </View>

      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  onlineCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  onlineText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bannerTextContainer: {
    marginLeft: 12,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  listContent: {
    padding: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  userCard: {
    width: CARD_WIDTH,
    marginBottom: 16,
    alignItems: 'center',
    position: 'relative',
    padding: 16,
  },
  onlineIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.backgroundSecondary,
    zIndex: 1,
  },
  avatar: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userCity: {
    fontSize: 13,
    color: colors.textTertiary,
    marginLeft: 4,
    marginRight: 4,
  },
  userAge: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  genderTag: {
    alignSelf: 'center',
  },
});
