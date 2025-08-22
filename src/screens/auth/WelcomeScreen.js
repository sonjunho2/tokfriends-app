import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={s.container}>
      {/* 로고 */}
      <View style={s.logoWrap}>
        <Image
          source={require('../../../assets/logo.png')}
          style={s.logo}
          resizeMode="contain"
        />
      </View>

      {/* 🔥 슬로건: 크게 + 포인트 컬러 + 중앙 정렬 */}
      <Text style={s.tagline}>딱 맞는 친구를 찾아보세요</Text>

      {/* 하단 설명 항목들 중앙 정렬 */}
      <View style={s.features}>
        <View style={s.featureRow}>
          <Ionicons name="location" size={20} color={colors.primary} />
          <Text style={s.featureText}>내 주변 친구 찾기</Text>
        </View>
        <View style={s.featureRow}>
          <Ionicons name="chatbubbles" size={20} color={colors.primary} />
          <Text style={s.featureText}>실시간 채팅</Text>
        </View>
        <View style={s.featureRow}>
          <Ionicons name="heart" size={20} color={colors.primary} />
          <Text style={s.featureText}>취향 기반 추천</Text>
        </View>
      </View>

      {/* 시작하기 버튼 (기존 로직 그대로 사용) */}
      <Pressable
        onPress={() => navigation.replace('Login')}
        style={s.ctaBtn}
      >
        <Text style={s.ctaText}>시작하기</Text>
      </Pressable>

      <Text style={s.terms}>
        계속하면 <Text style={s.underline}>이용약관</Text> 및{' '}
        <Text style={s.underline}>개인정보 처리방침</Text>에 동의하게 됩니다
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 48,
    alignItems: 'center',           // 전체 중앙 정렬
  },

  /* 로고 영역 */
  logoWrap: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  logo: {
    width: 120,
    height: 120,
  },

  /* 🔥 슬로건(“딱 맞는 친구를 찾아보세요”) */
  tagline: {
    marginTop: 16,
    fontSize: 22,                   // 크게
    fontWeight: '700',
    color: colors.primary,          // 포인트 컬러
    textAlign: 'center',
  },

  /* 기능 리스트 */
  features: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',           // 중앙 정렬
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
  },

  /* CTA 버튼 */
  ctaBtn: {
    marginTop: 24,
    width: '100%',
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },

  /* 약관 안내 */
  terms: {
    marginTop: 12,
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  underline: {
    textDecorationLine: 'underline',
  },
});
