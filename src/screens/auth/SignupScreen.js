// src/screens/auth/SignupScreen.js
import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ButtonPrimary from '../../components/ButtonPrimary';
import Card from '../../components/Card';
import Tag from '../../components/Tag';
import colors from '../../theme/colors';
import authStore from '../../store/auth';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !displayName || !gender || !birthYear) {
      Alert.alert('알림', '모든 필수 정보를 입력해주세요.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('알림', '비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    const year = parseInt(birthYear);
    if (isNaN(year) || year < 1900 || year > 2010) {
      Alert.alert('알림', '올바른 출생년도를 입력해주세요.');
      return;
    }

    setLoading(true);
    const result = await authStore.signup({
      email,
      password,
      displayName,
      gender,
      dob: `${birthYear}-01-01`,
    });
    setLoading(false);

    if (!result.success) {
      Alert.alert('회원가입 실패', result.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={28} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>딱친과 함께{'\n'}시작해요!</Text>
            <Text style={styles.subtitle}>
              간단한 정보만 입력하면 바로 시작할 수 있어요
            </Text>
          </View>

          <Card style={styles.formCard}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>이메일</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor={colors.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.textTertiary}
                  style={styles.inputIcon}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>비밀번호</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="6자 이상 입력해주세요"
                  placeholderTextColor={colors.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.inputIcon}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={colors.textTertiary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>닉네임</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="친구들에게 보여질 이름"
                  placeholderTextColor={colors.textTertiary}
                  value={displayName}
                  onChangeText={setDisplayName}
                  maxLength={20}
                />
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={colors.textTertiary}
                  style={styles.inputIcon}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>성별</Text>
              <View style={styles.genderContainer}>
                <Tag
                  label="남성"
                  selected={gender === 'male'}
                  onPress={() => setGender('male')}
                  size="medium"
                  style={styles.genderTag}
                />
                <Tag
                  label="여성"
                  selected={gender === 'female'}
                  onPress={() => setGender('female')}
                  size="medium"
                  style={styles.genderTag}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>출생년도</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="1995"
                  placeholderTextColor={colors.textTertiary}
                  value={birthYear}
                  onChangeText={setBirthYear}
                  keyboardType="number-pad"
                  maxLength={4}
                />
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={colors.textTertiary}
                  style={styles.inputIcon}
                />
              </View>
            </View>

            <ButtonPrimary
              title="가입하기"
              onPress={handleSignup}
              loading={loading}
              size="large"
              style={styles.signupButton}
            />
          </Card>

          <View style={styles.footer}>
            <Text style={styles.footerText}>이미 계정이 있으신가요?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>로그인</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 40,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  formCard: {
    padding: 24,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 44,
    fontSize: 16,
    color: colors.text,
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  loginLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});