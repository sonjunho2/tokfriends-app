import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import ButtonPrimary from '../../components/ButtonPrimary';
import Card from '../../components/Card';
import colors from '../../theme/colors';

import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

/**
 * route.params 로 이전 단계에서 모아둔 값들을 받습니다.
 *  - email, password, birthYear, nickname, gender, region, bio(선택)
 */
export default function ProfileSetupScreen({ route, navigation }) {
  const { login } = useAuth();

  const {
    email,
    password,
    birthYear,    // AgeScreen에서 선택한 출생년도 (연도)
    nickname,
    gender,
    region,       // LocationScreen 결과(문자열 또는 코드)
    bio = '',     // 자기소개(선택)
  } = route.params || {};

  const [imageUri, setImageUri] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '사진을 선택하려면 갤러리 접근 권한이 필요합니다.');
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      if (!res.canceled && res.assets?.[0]?.uri) {
        setImageUri(res.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('오류', '사진 선택 중 문제가 발생했습니다.');
    }
  };

  const onSubmit = async () => {
    // 필수값 확인
    if (!email || !password || !nickname || !birthYear || !gender) {
      Alert.alert('알림', '필수 정보가 누락되었습니다. 처음부터 다시 진행해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      // 1) 가입 (백엔드는 /auth/signup/email 사용)
      await apiClient.signup({
        email,
        password,
        displayName: nickname,
        gender: gender || 'other',
        dob: `${birthYear}-01-01`, // 연도만 받았으므로 1월1일로 변환
        region: region || null,
        bio,
      });

      // 2) (선택) 아바타 업로드 — 미선택이면 그냥 건너뜀
      // 서버에 아바타 업로드 엔드포인트가 없다면 이 블록은 생략하세요.
      // 아래는 예시입니다. 엔드포인트가 다르면 주석 처리하세요.
      /*
      if (imageUri) {
        const form = new FormData();
        form.append('file', {
          uri: imageUri,
          name: 'avatar.jpg',
          type: 'image/jpeg',
        });
        await apiClient.uploadAvatar(form); // <-- 필요 시 client에 구현
      }
      */

      // 3) 자동 로그인 후 홈 이동
      const res = await login(email, password);
      if (!res.success) {
        throw new Error(res.error || '자동 로그인에 실패했습니다.');
      }

      // 4) 네비게이션 reset → 홈 탭
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        '가입 처리 실패';
      Alert.alert('가입 처리 실패', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrap}>
        <Text style={styles.header}>간단한 프로필을 완성해주세요.</Text>
      </View>

      <Card style={styles.card}>
        <TouchableOpacity style={styles.avatarWrap} onPress={pickImage} activeOpacity={0.8}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color={colors.textTertiary} />
            </View>
          )}
          <View style={styles.addBadge}>
            <Text style={styles.addBadgeText}>사진 등록</Text>
          </View>
          <Text style={styles.countHint}>0/1 장</Text>
        </TouchableOpacity>

        {/* 자기소개는 선택 사항이므로 별도 입력 필드가 있다면 route.params.bio로 이미 전달됨 */}
      </Card>

      <View style={styles.footer}>
        <ButtonPrimary
          title="가입하기"
          onPress={onSubmit}
          loading={submitting}
          size="large"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerWrap: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  header: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  card: { marginHorizontal: 24, paddingVertical: 24, alignItems: 'center' },

  avatarWrap: { alignItems: 'center' },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  avatar: { width: 96, height: 96, borderRadius: 48, resizeMode: 'cover' },
  addBadge: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  addBadgeText: { color: colors.primary, fontWeight: '600' },
  countHint: { marginTop: 6, fontSize: 12, color: colors.textTertiary },

  footer: { marginTop: 'auto', padding: 24 },
});
