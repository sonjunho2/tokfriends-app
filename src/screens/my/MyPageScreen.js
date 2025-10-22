// src/screens/my/MyPageScreen.js
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import colors from '../../theme/colors';
import Avatar from '../../components/Avatar';
import { useAuth } from '../../context/AuthContext';

const FALLBACK_COVER =
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1080&q=80';

export default function MyPageScreen({ navigation }) {
  const { user } = useAuth();
  const nickname = user?.nickname || user?.name || '회원님';
  const locationLabel = user?.location || '서울 강남구';
  const balance = useMemo(() => {
    const p = user?.points ?? user?.balance ?? 0;
    return typeof p === 'number' ? p : parseInt(String(p).replace(/\D/g, ''), 10) || 0;
  }, [user]);

    const profilePayload = useMemo(
    () => ({
      name: nickname,
      location: locationLabel,
      title: user?.headline || '오늘 가입한 회원입니다',
      bio:
        user?.bio ||
        '마음이 맞는 친구를 기다리고 있어요. 드라이브와 카페 투어를 좋아해요!',
      avatar: user?.avatar || null,
      coverImage: user?.coverImage || FALLBACK_COVER,
    }),
    [nickname, locationLabel, user]
  );

  const handleOpenProfile = () => {
    navigation.navigate('ProfileDetail', { profile: profilePayload });
  };

  const handleGridPress = (key) => {
    switch (key) {
      case 'alerts':
        Alert.alert('준비중', '알림 센터 기능을 준비중입니다.');
        break;
      case 'support':
        Alert.alert('준비중', '1:1 문의 기능을 준비중입니다.');
        break;
      case 'notice':
        Alert.alert('준비중', '공지사항 기능을 준비중입니다.');
        break;
      case 'settings':
        navigation.navigate('Settings');
        break;
      case 'charge':
        Alert.alert('준비중', '무료 충전소 기능을 준비중입니다.');
        break;
      case 'album':
        Alert.alert('준비중', '구매한 앨범 목록을 준비중입니다.');
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 프로필 헤더 */}
        <TouchableOpacity activeOpacity={0.9} onPress={handleOpenProfile}>
          <View style={styles.profileCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nickLine}>
                <Text style={styles.nickname}>{nickname}</Text>
                <Text style={styles.nickSuffix}>님</Text>
              </Text>
              <Text style={styles.subtitle}>좋은 일이 생길 것 같아요!</Text>

              <View style={styles.pointRow}>
                <Text style={styles.pointLabel}>보유포인트</Text>
                <Text style={styles.pointValue}>{balance}p</Text>
              </View>
              <Text style={styles.ticketText}>첫 메시지 이용권 3/3</Text>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Avatar
              size={64}
              uri={user?.avatar}
              style={{ borderWidth: 2, borderColor: '#fff' }}
            />
            <TouchableOpacity
              style={styles.editBadge}
              activeOpacity={0.9}
                onPress={() => navigation.navigate('Settings')}
              >
                <Text style={styles.editBadgeText}>⚙</Text>
              </TouchableOpacity>
            </View>
        </View>
       </TouchableOpacity>

        {/* 기능 그리드 */}
        <View style={styles.gridCard}>
          <View style={styles.gridRow}>
            <GridItem
              label="알림"
              icon="🔔"
              onPress={() => handleGridPress('alerts')}
              dot={!!user?.hasUnread}
            />
            <GridItem
              label="1:1문의"
              icon="🎧"
              onPress={() => handleGridPress('support')}
            />
            <GridItem
              label="공지"
              icon="📢"
              onPress={() => handleGridPress('notice')}
            />
          </View>
          <View style={styles.gridRow}>
            <GridItem
              label="설정"
              icon="⚙️"
              onPress={() => navigation.navigate('Settings')}
            />
            <GridItem
              label="무료충전소"
              icon="⚡"
              badge="무료"
              onPress={() => handleGridPress('charge')}
            />
            <GridItem
              label="구매한 앨범"
              icon="🔒"
              badge="무료"
              onPress={() => handleGridPress('album')}
            />
          </View>
        </View>

        {/* 프로모 카드 */}
        <View style={styles.promoCard}>
          <Text style={styles.promoTop}>
            사진을 전부 등록하면 30P를 드려요!
          </Text>
          <Text style={styles.promoMain}>
            프로필 전부 작성하셔도 30P를 드려요!
          </Text>
          <View style={styles.promoPager}>
            <Text style={styles.pagerText}>1/1</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function GridItem({ label, icon, onPress, badge, dot }) {
  return (
    <TouchableOpacity style={styles.gridItem} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.gridIconWrap}>
        <Text style={styles.gridIcon}>{icon}</Text>
        {dot ? <View style={styles.redDot} /> : null}
        {badge ? (
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.gridLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const RADIUS = 18;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg || '#F7F7FA',
    paddingHorizontal: 16,
  },
  profileCard: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  nickLine: { flexDirection: 'row', alignItems: 'flex-end' },
  nickname: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary || '#222',
  },
  nickSuffix: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary || '#222',
    marginLeft: 2,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textSecondary || '#6A6A6A',
    fontWeight: '600',
  },
  pointRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  pointLabel: {
    fontSize: 12,
    color: colors.textSecondary || '#6A6A6A',
    fontWeight: '700',
  },
  pointValue: {
    fontSize: 20,
    color: colors.primary || '#7B61FF',
    fontWeight: '900',
  },
  ticketText: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSecondary || '#6A6A6A',
  },
  editBadge: {
    position: 'absolute',
    right: 0,
    bottom: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#E6E6EA',
    borderWidth: 1,
  },
  editBadgeText: {
    fontSize: 14,
    color: colors.textPrimary || '#222',
    fontWeight: '900',
  },

  gridCard: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS,
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 6,
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  gridIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#F3F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gridIcon: {
    fontSize: 26,
  },
  gridLabel: {
    fontSize: 13,
    color: colors.textPrimary || '#222',
    fontWeight: '700',
  },
  redDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4D4F',
  },
  freeBadge: {
    position: 'absolute',
    bottom: -8,
    left: -8,
    backgroundColor: '#FF4D4F',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: '#fff',
  },
  freeBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },

  promoCard: {
    marginTop: 16,
    backgroundColor: '#FFE0D6',
    borderRadius: RADIUS,
    padding: 16,
  },
  promoTop: {
    color: '#FF6A55',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },
  promoMain: {
    color: colors.textPrimary || '#222',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 24,
  },
  promoPager: {
    position: 'absolute',
    right: 12,
    bottom: 10,
    backgroundColor: '#00000020',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  pagerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
});
