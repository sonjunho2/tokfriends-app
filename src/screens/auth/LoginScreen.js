import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ButtonPrimary from '../../components/ButtonPrimary';
import Card from '../../components/Card';
import colors from '../../theme/colors';
import animations from '../../theme/animations';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const emailBorderAnim = useRef(new Animated.Value(0)).current;
  const passwordBorderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
    ]).start();
  }, []);

  useEffect(() => {
    Animated.timing(emailBorderAnim, {
      toValue: emailFocused ? 1 : 0,
      duration: animations.timing.fast,
      useNativeDriver: false,
    }).start();
  }, [emailFocused]);

  useEffect(() => {
    Animated.timing(passwordBorderAnim, {
      toValue: passwordFocused ? 1 : 0,
      duration: animations.timing.fast,
      useNativeDriver: false,
    }).start();
  }, [passwordFocused]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('알림', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    
    try {
      const result = await login(email.trim(), password);
      
      if (!result.success) {
        Alert.alert('로그인 실패', result.error);
      }
    } catch (error) {
      Alert.alert('로그인 실패', '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={colors.gradients.ocean}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={[
                styles.headerSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <LinearGradient
                  colors={colors.gradients.glass}
                  style={styles.backButtonGradient}
                >
                  <Ionicons name="arrow-back" size={24} color={colors.textInverse} />
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.header}>
                <Text style={styles.title}>다시 만나서{'\n'}반가워요!</Text>
                <Text style={styles.subtitle}>
                  계정에 로그인하고 친구들과 대화를 시작하세요
                </Text>
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.formSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Card glass={true} glow={true} style={styles.formCard}>
                <LinearGradient
                  colors={colors.gradients.glass}
                  style={styles.formGradient}
                >
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>이메일</Text>
                    <Animated.View
                      style={[
                        styles.inputWrapper,
                        {
                          borderColor: emailBorderAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [colors.border, colors.primary],
                          }),
                          shadowOpacity: emailBorderAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 0.15],
                          }),
                        },
                      ]}
                    >
                      <TextInput
                        style={styles.input}
                        placeholder="your@email.com"
                        placeholderTextColor={colors.textTertiary}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!loading}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                      />
                      <View style={styles.inputIcon}>
                        <Ionicons
                          name="mail-outline"
                          size={20}
                          color={emailFocused ? colors.primary : colors.textTertiary}
                        />
                      </View>
                    </Animated.View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>비밀번호</Text>
                    <Animated.View
                      style={[
                        styles.inputWrapper,
                        {
                          borderColor: passwordBorderAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [colors.border, colors.primary],
                          }),
                          shadowOpacity: passwordBorderAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 0.15],
                          }),
                        },
                      ]}
                    >
                      <TextInput
                        style={styles.input}
                        placeholder="비밀번호를 입력하세요"
                        placeholderTextColor={colors.textTertiary}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        editable={!loading}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.inputIcon}
                        disabled={loading}
                      >
                        <Ionicons
                          name={showPassword ? 'eye' : 'eye-off'}
                          size={20}
                          color={passwordFocused ? colors.primary : colors.textTertiary}
                        />
                      </TouchableOpacity>
                    </Animated.View>
                  </View>

                  <TouchableOpacity style={styles.forgotPassword} disabled={loading}>
                    <Text style={styles.forgotPasswordText}>비밀번호를 잊으셨나요?</Text>
                  </TouchableOpacity>

                  <ButtonPrimary
                    title="로그인"
                    onPress={handleLogin}
                    loading={loading}
                    size="large"
                    gradient="primary"
                    glow={true}
                    shimmer={!loading}
                    style={styles.loginButton}
                  />
                </LinearGradient>
              </Card>
            </Animated.View>

            <Animated.View
              style={[
                styles.footerSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.footer}>
                <Text style={styles.footerText}>아직 계정이 없으신가요?</Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Signup')}
                  disabled={loading}
                >
                  <Text style={styles.signupLink}>회원가입</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  headerSection: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 32,
    alignSelf: 'flex-start',
  },
  backButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.textInverse,
    lineHeight: 44,
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textInverse,
    lineHeight: 24,
    textAlign: 'center',
    opacity: 0.9,
  },
  formSection: {
    marginBottom: 32,
  },
  formCard: {
    overflow: 'hidden',
  },
  formGradient: {
    padding: 28,
    borderRadius: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
    borderWidth: 2,
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingRight: 52,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 32,
    padding: 4,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  loginButton: {
    marginTop: 8,
  },
  footerSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundGlass,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.textInverse + '20',
  },
  footerText: {
    fontSize: 14,
    color: colors.textInverse,
    marginRight: 8,
    opacity: 0.9,
  },
  signupLink: {
    fontSize: 14,
    color: colors.textInverse,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
