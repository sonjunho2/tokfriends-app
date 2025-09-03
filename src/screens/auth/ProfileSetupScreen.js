// src/screens/auth/ProfileSetupScreen.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import ButtonPrimary from '../../components/ButtonPrimary';
import Card from '../../components/Card';
import colors from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';

/**
 * 이 화면으로 들어올 때 이전 단계에서 아래 params를 넘겨주세요.
 * route.params = {
 *   email,          // Signup 화면에서 입력
 *   password,       // Signup 화면에서 입력
 *   displayName,    // Nickname 단계
 *   gender,         // Gender 단계 (male/female/other)
 *   dob,            // Age 단계에서 만든 YYYY-MM-DD (연도->날짜 변환)
 *   region,         // Location 단계 (선택한 거주지 문자열)
 * }
 */
export default function ProfileSetupScreen({ route, navigation }) {
  const { signup } = useAuth();

  const base = route?.params || {};
  const [aboutMe, setAboutMe] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    // 필수: email / password / displayName / gender / dob
    return Boolean(
      base?.email &&
        base?.password &&
        base?.displayName &&
        base?.gender &&
        base?.dob
    );
  }, [base]);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '사진 라이브러리 접근 권한이 필요합니다.');
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        selectionLimit: 1,
      });
      if (!res.canceled && res.assets?.[0]?.uri) {
        setPhotoUri(res.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('오류', '사진을 선택할 수 없습니다.');
    }
  };

  const onSubmit = async () => {
    if (!canSubmit) {
      Alert.alert('필수 정보 누락', '이메일/비밀번호/닉네임/성별/출생년도는 필수입니다.');
      return;
    }

    setLoading(true);
    try {
      // 1) 가입은 "텍스트 필드만" 전송 (이미지는 가입 후 별도 업로드로 분리)
      const payload = {
        email: base.email,
        password: base.password,
        displayName: base.displayName,
        gender: base.gender,
        dob: base.dob,           // YYYY-MM-DD
        region: base.region || null,
        // aboutMe는 서버 스키마에 따라 선택적으로 보내세요.
        // 현재 백엔드 스펙을 모르면 제외해도 무방.
        // aboutMe,
      };

      const result = await signup(payload);
      if (!result.success) {
        throw new Error(result.error || '가입에 실패했습니다.');
      }

      // 2) (선택) 프로필 이미지 업로드 – 백엔드 엔드포인트 확정되면 아래 로직 활성화
      // if (photoUri) {
      //   const form = new FormData();
      //   form.append('file', {
      //     uri: photoUri,
      //     name: 'avatar.jpg',
      //     type: 'image/jpeg',
      //   });
      //   await apiClient.uploadAvatar(form); // <- 서버에 맞는 API 추가 필요
      // }

      // 3) 메인으로 리셋 이동
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }], // navigation/index.js에서 등록한 이름과 동일해야 함
      });
    } catch (e) {
      Alert.alert('가입 처리 실패', e?.message || '서버와 통신에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>마지막이에요!{'\n'}간단한 프로필을 완성해주세요.</Text>

        <View style={styles.avatarBox}>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8} style={styles.avatarBtn}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={36} color={colors.textTertiary} />
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage} style={styles.photoAdd}>
            <Text style={styles.photoAddText}>사진 등록</Text>
          </TouchableOpacity>
          <Text style={styles.photoHint}>{photoUri ? '1/1 장' : '0/1 장'}</Text>
        </View>

        <Card style={styles.card}>
          <Text style={styles.label}>자기소개</Text>
          <TextInput
            style={styles.textArea}
            placeholder="간단한 자기소개를 작성해 주세요."
            placeholderTextColor={colors.textTertiary}
            value={aboutMe}
            onChangeText={setAboutMe}
            maxLength={100}
            multiline
          />
          <Text style={styles.counter}>{aboutMe.length}/100 글자</Text>
        </Card>

        <ButtonPrimary
          title="가입하기"
          onPress={onSubmit}
          loading={loading}
          disabled={!canSubmit || loading}
          size="large"
          style={{ marginTop: 12 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 32,
    marginBottom: 22,
    textAlign: 'center',
  },
  avatarBox: { alignItems: 'center', marginBottom: 16 },
  avatarBtn: {
    width: 120,
    height: 120,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: { width: '100%', height: '100%' },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoAdd: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  photoAddText: { color: colors.primary, fontWeight: '600' },
  photoHint: { marginTop: 6, color: colors.textTertiary },
  card: { padding: 16, marginTop: 12 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 },
  textArea: {
    minHeight: 120,
    borderRadius: 12,
    backgroundColor: colors.backgroundTertiary,
    padding: 12,
    color: colors.text,
    textAlignVertical: 'top',
  },
  counter: { alignSelf: 'flex-end', marginTop: 6, color: colors.textTertiary },
});
