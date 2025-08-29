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
import { useAuth } from '../../context/AuthContext';
import ButtonPrimary from '../../components/ButtonPrimary';
import Card from '../../components/Card';
import Tag from '../../components/Tag';
import colors from '../../theme/colors';
import animations from '../../theme/animations';

const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export default function SignupScreen({ navigation }) {
  const { signup } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

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
    const fields = [email, password, displayName, gender, birthYear];
    const filledCount = fields.filter(field => field.length > 0).length;
    const progress = filledCount / fields.length;
    
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: animations.timing.normal,
      useNativeDriver: false,
    }).start();
  }, [email, password, displayName, gender, birthYear]);

  const handleSignup = async () => {
    if (!email || !password || !displayName || !gender || !birthYear) {
      Alert.alert('알림', '모든 필수 정보를 입력해주세요.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('알림', '올바른 이메일 형식을 입력해주세요.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('알림', '비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    const year = parseInt(birthYear);
    if (isNaN(year) || year < 1900 || year > 2010) {
      Alert.alert('알림', '올바른 출생년도를 입력해주세요.');
      return;
    }

    if (loading) return;

    setLoading(true);
    try {
      const result = await signup({
        email: email.trim().toLowerCase(),
        password,
        displayName: displayName.trim(),
        gender,
        dob: `${birthYear}-01-01`,
      });

      if (!result.success) {
        Alert.alert('회원가입 실패', result.error);
      }
    } catch (e) {
      Alert.alert('회원가입 실패', '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={colors.gradients.sunset}
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
                <Text style={styles.title}>딱친과 함께{'\n'}시작해요!</Text>
                <Text style={styles.subtitle}>
                  간단한 정보만 입력하면 바로 시작할 수 있어요
                </Text>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        width: progressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        }),
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>정보 입력 중...</Text>
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
                    <View
                      style={[
                        styles.inputWrapper,
                        focusedField === 'email' && styles.inputFocused,
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
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField('')}
                      />
                      <View style={styles.inputIcon}>
                        <Ionicons
                          name="mail-outline"
                          size={20}
                          color={focusedField === 'email' ? colors.primary : colors.textTertiary}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>비밀번호</Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        focusedField === 'password' && styles.inputFocused,
                      ]}
                    >
                      <TextInput
                        style={styles.input}
                        placeholder="8자 이상 입력해주세요"
                        placeholderTextColor={colors.textTertiary}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        editable={!loading}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField('')}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.inputIcon}
                        disabled={loading}
                      >
                        <Ionicons
                          name={showPassword ? 'eye' : 'eye-off'}
                          size={20}
                          color={focusedField === 'password' ? colors.primary : colors.textTertiary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>닉네임</Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        focusedField === 'displayName' && styles.inputFocused,
                      ]}
                    >
                      <TextInput
                        style={styles.input}
                        placeholder="친구들에게 보여질 이름"
                        placeholderTextColor={colors.textTertiary}
                        value={displayName}
                        onChangeText={setDisplayName}
                        maxLength={20}
                        editable={!loading}
                        onFocus={() => setFocusedField('displayName')}
                        onBlur={() => setFocusedField('')}
                      />
                      <View style={styles.inputIcon}>
                        <Ionicons
                          name="person-outline"
                          size={20}
                          color={focusedField === 'displayName' ? colors.primary : colors.textTertiary}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>성별</Text>
                    <View style={styles.genderContainer}>
                      <Tag
                        label="남성"
                        selected={gender === 'male'}
                        onPress={() => !loading && setGender('male')}
                        size="medium"
                        gradient={true}
                        glow={gender === 'male'}
                        animated={true}
                        style={styles.genderTag}
                      />
                      <Tag
                        label="여성"
                        selected={gender === 'female'}
                        onPress={() => !loading && setGender('female')}
                        size="medium"
                        color="accent"
                        gradient={true}
                        glow={gender === 'female'}
                        animated={true}
                        style={styles.genderTag}
                      />
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>출생년도</Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        focusedField === 'birthYear' && styles.inputFocused,
                      ]}
                    >
                      <TextInput
                        style={styles.input}
                        placeholder="1995"
                        placeholderTextColor={colors.textTertiary}
                        value={birthYear}
                        onChangeText={setBirthYear}
                        keyboardType="number-pad"
                        maxLength={4}
                        editable={!loading}
                        onFocus={() => setFocusedField('birthYear')}
                        onBlur={() => setFocusedField('')}
                      />
                      <View style={styles.inputIcon}>
                        <Ionicons
                          name="calendar-outline"
                          size={20}
                          color={focusedField === 'birthYear' ? colors.primary : colors.textTertiary}
                        />
                      </View>
                    </View>
                  </View>

                  <ButtonPrimary
                    title="가입하기"
                    onPress={handleSignup}
                    loading={loading}
                    size="large"
                    gradient="sunset"
                    glow={true}
                    shimmer={!loading}
                    style={styles.signupButton}
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
                <Text style={styles.footerText}>이미 계정이 있으신가요?</Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Login')}
                  disabled={loading}
                >
                  <Text style={styles.loginLink}>로그인</Text>
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
    paddingBottom: 32,
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
    marginBottom: 24,
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
  progressContainer: {
    alignItems: 'center',
  },
  progressTrack: {
    width: 200,
    height: 4,
    backgroundColor: colors.textInverse + '30',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.textInverse,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: colors.textInverse,
    opacity: 0.8,
    fontWeight: '600',
  },
  formSection: {
    marginBottom: 24,
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
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
  },
  inputFocused: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
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
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderTag: {
    flex: 1,
  },
  signupButton: {
    marginTop: 8,
  },
  footerSection: {
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
  loginLink: {
    fontSize: 14,
    color: colors.textInverse,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
