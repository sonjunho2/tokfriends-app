import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ButtonPrimary from '../../components/ButtonPrimary';
import colors from '../../theme/colors';
import animations from '../../theme/animations';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
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
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: animations.timing.verySlow * 4,
          useNativeDriver: true,
        })
      ),
    ]).start();
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={colors.gradients.cosmos}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Animated.View 
            style={[
              styles.topSection,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ],
              },
            ]}
          >
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={colors.gradients.glass}
                style={styles.iconGradient}
              >
                <Animated.View
                  style={[
                    styles.iconWrapper,
                    {
                      transform: [{ rotate: rotateInterpolate }],
                    },
                  ]}
                >
                  <Ionicons name="heart" size={64} color={colors.textInverse} />
                </Animated.View>
              </LinearGradient>
              
              <View style={styles.glowRing} />
              <View style={[styles.glowRing, styles.glowRingDelay]} />
            </View>
            
            <Text style={styles.title}>딱친</Text>
            <Text style={styles.subtitle}>딱 맞는 친구를 찾아보세요</Text>
            
            <View style={styles.features}>
              {[
                { icon: 'location', text: '내 주변 친구 찾기', color: colors.accent },
                { icon: 'chatbubbles', text: '실시간 채팅', color: colors.success },
                { icon: 'sparkles', text: 'AI 친구 추천', color: colors.secondary },
              ].map((feature, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.featureItem,
                    {
                      opacity: fadeAnim,
                      transform: [{
                        translateX: slideAnim.interpolate({
                          inputRange: [0, 50],
                          outputRange: [0, (index + 1) * 20],
                        })
                      }],
                    },
                  ]}
                >
                  <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                    <Ionicons name={feature.icon} size={20} color={feature.color} />
                  </View>
                  <Text style={styles.featureText}>{feature.text}</Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.bottomSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <ButtonPrimary
              title="시작하기"
              onPress={() => navigation.navigate('Signup')}
              size="large"
              gradient="primary"
              glow={true}
              shimmer={true}
              style={styles.button}
            />
            
            <ButtonPrimary
              title="이미 계정이 있어요"
              onPress={() => navigation.navigate('Login')}
              size="large"
              variant="glass"
              style={[styles.button, styles.secondaryButton]}
            />
            
            <Text style={styles.terms}>
              계속하면 <Text style={styles.link}>이용약관</Text> 및{' '}
              <Text style={styles.link}>개인정보 처리방침</Text>에 동의하게 됩니다
            </Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
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
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: colors.textInverse + '30',
    backgroundColor: 'transparent',
  },
  glowRingDelay: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderColor: colors.textInverse + '15',
  },
  title: {
    fontSize: 56,
    fontWeight: '900',
    color: colors.textInverse,
    letterSpacing: -2,
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 20,
    color: colors.textInverse,
    marginBottom: 48,
    opacity: 0.9,
    textAlign: 'center',
  },
  features: {
    width: '100%',
    paddingHorizontal: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: colors.backgroundGlass,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.textInverse + '20',
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    color: colors.textInverse,
    fontWeight: '600',
  },
  bottomSection: {
    paddingBottom: 40,
  },
  button: {
    marginBottom: 16,
  },
  secondaryButton: {
    backgroundColor: colors.backgroundGlass,
    borderWidth: 1,
    borderColor: colors.textInverse + '30',
  },
  terms: {
    fontSize: 13,
    color: colors.textInverse,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 20,
    opacity: 0.8,
  },
  link: {
    color: colors.textInverse,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
