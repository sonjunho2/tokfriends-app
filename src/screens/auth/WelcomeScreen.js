import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ButtonPrimary from '../../components/ButtonPrimary';
import colors from '../../theme/colors';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="heart" size={80} color={colors.primary} />
          </View>
          
          <Text style={styles.title}>딱친</Text>
          <Text style={styles.subtitle}>딱 맞는 친구를 찾아보세요</Text>
          
          <View style={styles.features}>
            <View style={styles.featureItem}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <Text style={styles.featureText}>내 주변 친구 찾기</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="chatbubbles" size={20} color={colors.primary} />
              <Text style={styles.featureText}>실시간 채팅</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="sparkles" size={20} color={colors.primary} />
              <Text style={styles.featureText}>AI 친구 추천</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.bottomSection}>
          <ButtonPrimary
            title="시작하기"
            onPress={() => navigation.navigate('Signup')}
            size="large"
            style={styles.button}
          />
          
          <ButtonPrimary
            title="이미 계정이 있어요"
            onPress={() => navigation.navigate('Login')}
            size="large"
            variant="outline"
            style={[styles.button, styles.secondaryButton]}
          />
          
          <Text style={styles.terms}>
            계속하면 <Text style={styles.link}>이용약관</Text> 및{' '}
            <Text style={styles.link}>개인정보 처리방침</Text>에 동의하게 됩니다
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.1,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 48,
    textAlign: 'center',
  },
  features: {
    width: '100%',
    paddingHorizontal: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: colors.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 16,
    fontWeight: '600',
  },
  bottomSection: {
    paddingBottom: 40,
  },
  button: {
    marginBottom: 12,
  },
  secondaryButton: {},
  terms: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 18,
  },
  link: {
    color: colors.primary,
    fontWeight: '600',
  },
});
