// src/screens/main/ProfileDetailScreen.js
import React, { useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../../components/Avatar';
import colors from '../../theme/colors';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1080&q=80';

export default function ProfileDetailScreen({ navigation, route }) {
  const profile = route?.params?.profile;

  const data = useMemo(() => {
    const location = profile?.location || '서울 · 5km 이내';
    return {
      name: profile?.name || '회원님',
      location,
      title: profile?.title || '오늘 가입한 회원입니다',
      bio:
        profile?.bio ||
        '새로운 인연을 기다리고 있어요. 반려견과 드라이브하는 것을 좋아해요!',
      avatar: profile?.avatar || null,
      coverImage: profile?.coverImage || FALLBACK_IMAGE,
      age: profile?.age,
      distanceKm: profile?.distanceKm ?? profile?.distance,
      points: profile?.points,
    };
  }, [profile]);

  const metaItems = useMemo(() => {
    const items = [];
    if (typeof data.age === 'number') {
      items.push(`${data.age}세`);
    }
    if (typeof data.distanceKm === 'number') {
      items.push(`${data.distanceKm}km`);
    }
    if (typeof data.points === 'number') {
      items.push(`${data.points}P`);
    }
    return items;
  }, [data.age, data.distanceKm, data.points]);

  const handleMessage = () => {
    navigation.navigate('Chats', { screen: 'ChatsMain', params: { initialSeg: '신규' } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrapper}>
          <ImageBackground
            source={{ uri: data.coverImage }}
            style={styles.cover}
            imageStyle={styles.coverImage}
          >
            <View style={styles.coverOverlay} />
            <View style={styles.heroHeader}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => navigation.goBack()}
                hitSlop={8}
              >
                <Ionicons name="chevron-back" size={26} color={colors.textInverse} />
              </TouchableOpacity>
              <View style={styles.headerSpacer} />
            </View>
            <View style={styles.avatarWrapper}>
              <Avatar
                size={96}
                uri={data.avatar}
                name={data.name}
                showBorder
                shape="circle"
                style={styles.avatar}
              />
            </View>
          </ImageBackground>
        </View>

        <View style={styles.body}>
          <Text style={styles.tagline}>{data.title}</Text>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.location}>{data.location}</Text>

          {metaItems.length > 0 && (
            <View style={styles.metaRow}>
              {metaItems.map((item) => (
                <View key={item} style={styles.metaBadge}>
                  <Text style={styles.metaBadgeText}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.infoCard}>
            <Ionicons name="sparkles-outline" size={20} color={colors.primary} />
            <Text style={styles.infoText}>{data.bio}</Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleMessage} activeOpacity={0.85}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.textInverse} />
            <Text style={styles.primaryButtonText}>메시지 보내기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroWrapper: {
    position: 'relative',
  },
  cover: {
    height: 360,
    justifyContent: 'flex-end',
  },
  coverImage: {
    resizeMode: 'cover',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  heroHeader: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 42,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: -60,
  },
  avatar: {
    borderWidth: 4,
    borderColor: colors.background,
  },
  body: {
    paddingTop: 80,
    paddingHorizontal: 24,
    gap: 20,
  },
  tagline: {
    alignSelf: 'center',
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  name: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '900',
    color: colors.text,
  },
  location: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaBadge: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.pillActiveBg,
    borderWidth: 1,
    borderColor: colors.pillActiveBorder,
  },
  metaBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.backgroundSecondary,
    padding: 18,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
    lineHeight: 22,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: 14,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textInverse,
  },
});
