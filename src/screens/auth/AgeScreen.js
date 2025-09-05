// src/screens/auth/AgeScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Card from '../../components/Card';
import ButtonPrimary from '../../components/ButtonPrimary';
import colors from '../../theme/colors';

export default function AgeScreen({ navigation, route }) {
  const [birthYear, setBirthYear] = useState('');

  const onNext = () => {
    const y = parseInt(birthYear, 10);
    const thisYear = new Date().getFullYear();
    if (!y || y < 1900 || y > thisYear) {
      alert('올바른 출생연도를 입력해주세요. 예) 1995');
      return;
    }
    // 다음 화면으로 필요한 값만 넘김
    navigation.navigate('Nickname', {
      ...((route?.params || {})),
      birthYear: y,
      dob: `${y}-01-01`,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.body}>
          <Text style={styles.title}>나이가 어떻게 되시나요?</Text>

          <Card style={styles.card}>
            <TextInput
              style={styles.input}
              value={birthYear}
              onChangeText={setBirthYear}
              keyboardType="number-pad"
              placeholder="출생연도 4자리 (예: 1995)"
              placeholderTextColor={colors.textTertiary}
              maxLength={4}
            />
          </Card>

          <View style={styles.bottom}>
            <ButtonPrimary
              title="다음"
              onPress={onNext}
              size="large"
            />
            <TouchableOpacity
              style={{ marginTop: 12, alignSelf: 'center' }}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.linkText}>이전으로</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 32,
  },
  card: {
    width: '100%',
    padding: 16,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
  },
  bottom: {
    marginTop: 'auto',
    paddingVertical: 16,
    width: '100%',
  },
  linkText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
