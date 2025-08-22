import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import colors from '../../theme/colors';

export default function WelcomeScreen() {
  const nav = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      {/* 본문: 스크롤 가능, 버튼과 분리 */}
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.heroIcon}>
          <Ionicons name="heart" size={84} color="#ff4477" />
        </View>

        <Text style={s.title}>딱친</Text>
        <Text style={s.subtitle}>딱 맞는 친구를 찾아보세요</Text>

        <View style={s.features}>
          <Feature icon="location" text="내 주변 친구 찾기" />
          <Feature icon="chatbubbles" text="실시간 채팅" />
          <Feature icon="star" text="맞춤 추천" />
        </View>
      </ScrollView>

      {/* 고정 하단 버튼 */}
      <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Pressable style={s.cta} onPress={() => nav.navigate('Login')}>
          <Text style={s.ctaText}>시작하기</Text>
        </Pressable>
        <Text style={s.legal}>
          계속하면 <Text style={s.link}>이용약관</Text> 및 <Text style={s.link}>개인정보 처리방침</Text>에 동의하게 됩니다
        </Text>
      </View>
    </SafeAreaView>
  );
}

function Feature({ icon, text }) {
  return (
    <View style={s.featureRow}>
      <Ionicons name={icon} size={20} color={colors.primary} style={{ width: 28 }} />
      <Text style={s.featureText}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 12, // 본문 자체 여백 (푸터와 별개)
  },
  heroIcon: {
    alignSelf: 'center',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#ffe3ea',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#ff4477',
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 16,
    marginTop: 12,
  },
  features: {
    marginTop: 28,
    gap: 14,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 16,
    color: '#111827',
  },
  footer: {
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  cta: {
    backgroundColor: '#ff4477',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 4,
  },
  ctaText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
  },
  legal: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 10,
    marginBottom: 4,
  },
  link: {
    color: '#ef4444',
    fontWeight: '700',
  },
});
