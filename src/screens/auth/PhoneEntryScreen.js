// src/screens/auth/PhoneEntryScreen.js
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../theme/colors';
import ButtonPrimary from '../../components/ButtonPrimary';

function sanitizePhone(input) {
  return String(input || '')
    .replace(/[^0-9]/g, '')
    .replace(/^82/, '0');
}

function formatPhone(input) {
  const digits = sanitizePhone(input);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length <= 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

export default function PhoneEntryScreen({ navigation }) {
  const [phoneRaw, setPhoneRaw] = useState('');
  const [loading, setLoading] = useState(false);
  const formatted = useMemo(() => formatPhone(phoneRaw), [phoneRaw]);
  const digits = useMemo(() => sanitizePhone(phoneRaw), [phoneRaw]);
  const valid = digits.length >= 10 && digits.length <= 11;

  const handleNext = async () => {
    if (!valid) {
      Alert.alert('안내', '휴대폰 번호를 정확히 입력해 주세요.');
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      navigation.navigate('Agreement', {
        phone: digits,
        formattedPhone: formatted,
        verificationId: 'local-test-verification',
      });
    } catch (error) {
      Alert.alert('전송 실패', error?.message || '인증번호를 전송하지 못했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.inner}>
          <Text style={styles.title}>휴대폰 번호로 로그인해요</Text>
          <Text style={styles.description}>
            인증번호를 전송할 수 있는 휴대폰 번호를 입력해 주세요.
          </Text>

          <View style={styles.inputCard}>
            <Text style={styles.label}>휴대폰 번호</Text>
            <TextInput
              style={styles.input}
              placeholder="010-1234-5678"
              placeholderTextColor={colors.textTertiary}
              keyboardType="phone-pad"
              value={formatted}
              onChangeText={(next) => setPhoneRaw(next)}
              editable={!loading}
              returnKeyType="done"
              onSubmitEditing={handleNext}
            />
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setPhoneRaw('')}
              disabled={loading || !digits}
            >
              <Text style={[styles.clearText, (!digits || loading) && { opacity: 0.4 }]}>지우기</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }} />

          <ButtonPrimary
            title="인증번호 보내기"
            onPress={handleNext}
            disabled={!valid || loading}
            loading={loading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    marginTop: 12,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputCard: {
    marginTop: 36,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: 14,
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  clearButton: {
    alignSelf: 'flex-end',
    marginTop: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  clearText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
