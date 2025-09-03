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
import colors from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import { markHasAccount } from '../../utils/accountFlag';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const emailTrimmed = email.trim();

    if (!emailTrimmed || !password) {
      Alert.alert('알림', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    if (loading) return; // 중복 제출 방지
    setLoading(true);

    try {
      const result = await login(emailTrimmed, password);

      if (result?.success) {
        // 로그인 성공 → 회원 플래그 저장 (Welcome에서 자동 Login 이동용)
        await markHasAccount();
        // 별도 네비게이션 불필요: AuthContext 갱신으로 RootNavigator가 MainTabs로 전환
      } else {
        const msg = result?.error || '계정을 확인해주세요.';
        Alert.alert('로그인 실패', msg);
      }
    } catch (error) {
      console.warn('[Login] error:', error?.message || error);
      Alert.alert('로그인 실패', '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
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
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Ionicons name="arrow-back" size={28} color={colors.text || '#111827'} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>다시 만나서{'\n'}반가워요!</Text>
            <Text style={styles.subtitle}>
              계정에 로그인하고 친구들과 대화를 시작하세요
            </Text>
          </View>

          <Card style={styles.formCard}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>이메일</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor={colors.textTertiary || '#9CA3AF'}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                  returnKeyType="next"
                />
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.textTertiary || '#9CA3AF'}
                  style={styles.inputIcon}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>비밀번호</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textTertiary || '#9CA3AF'}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!loading}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.inputIcon}
                  disabled={loading}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={colors.textTertiary || '#9CA3AF'}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotPassword} disabled={loading}>
              <Text style={styles.forgotPasswordText}>비밀번호를 잊으셨나요?</Text>
            </TouchableOpacity>

            <ButtonPrimary
              title="로그인"
              onPress={handleLogin}
              loading={loading}
              size="large"
              style={styles.loginButton}
            />
          </Card>

          <View style={styles.footer}>
            <Text style={styles.footerText}>아직 계정이 없으신가요?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Agreement')}
              disabled={loading}
            >
              <Text style={styles.signupLink}>시작하기</Text>
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
    backgroundColor: colors.background || '#F7F8FA',
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
    alignSelf: 'flex-start',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text || '#111827',
    lineHeight: 40,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary || '#6B7280',
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
    color: colors.text || '#111827',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: colors.backgroundTertiary || '#EEF1F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 44,
    fontSize: 16,
    color: colors.text || '#111827',
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary || '#F36C93',
    fontWeight: '500',
  },
  loginButton: {
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
    color: colors.textSecondary || '#6B7280',
    marginRight: 8,
  },
  signupLink: {
    fontSize: 14,
    color: colors.primary || '#F36C93',
    fontWeight: '600',
  },
});
