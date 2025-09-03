import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import colors from '../../theme/colors';
import InputOutlined from '../../components/InputOutlined';
import ButtonPrimary from '../../components/ButtonPrimary';
import { markHasAccount } from '../../utils/accountFlag';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';

// ✅ 사진 미등록 시 사용할 기본 아바타 이미지(URL)
// (원하면 프로젝트 상수 파일로 빼도 됩니다)
const DEFAULT_AVATAR_URL =
  'https://placehold.co/512x512/png?text=Avatar';

export default function ProfileSetupScreen({ navigation, route }) {
  const { setUser, login } = useAuth?.() || {};
  const [photo, setPhoto] = useState(null); // ✅ 단일 이미지만 허용
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const askPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진을 선택하려면 사진 라이브러리 접근 권한이 필요합니다.');
      return false;
    }
    return true;
  };

  const pick = async () => {
    if (!(await askPermission())) return;

    const res = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: false,  // ✅ 1장만
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,             // 선택 시 간단 편집 허용(정사각 비율 권장)
      aspect: [1, 1],
      quality: 0.85,
    });

    if (!res.canceled) {
      const chosen = (res.assets && res.assets[0]) ? res.assets[0] : res;
      setPhoto({ uri: chosen.uri });
    }
  };

  /** 가입 완료 → 홈(MainTabs) 진입 보장 */
  const handleComplete = async () => {
    if (loading) return;

    setLoading(true);
    try {
      // 1) 이전 단계 파라미터 + 프로필 입력 정리
      const base = route?.params || {}; // { email, password, age, gender, location, nickname ... }
      const payload = {
        ...base,
        bio: bio || '',
        // 서버에서 URL 기반 아바타를 지원한다면 avatarUrl로 기본값 전달
        avatarUrl: photo?.uri ? undefined : DEFAULT_AVATAR_URL,
        // 서버가 multipart 업로드를 받거나 추후 업로드 파이프라인이라면 photos로도 함께 전달
        photos: photo?.uri ? [{ uri: photo.uri }] : [],
        // 필요 시 클라이언트 타입 힌트(선택)
        _client: { platform: Platform.OS, version: 'profile-setup@1.0' },
      };

      // 2) 가입 요청
      const resp = await apiClient.signup(payload);

      // 3) 가입 플래그 기록 (Welcome이 Login으로 자동 이동하도록)
      await markHasAccount();

      // 4) 토큰/유저가 응답에 있으면 즉시 세션 세팅 → 홈 자동 전환
      if (resp?.token && resp?.user && typeof setUser === 'function') {
        setUser({ ...resp.user, token: resp.token }, resp.token);
        return; // RootNavigator가 user 감지 → AppFlow(MainTabs)
      }

      // 5) 응답에 토큰이 없으면 자동 로그인 시도 (이전 단계에서 받은 email/password 이용)
      const email = (base?.email || '').trim();
      const password = base?.password || '';
      if (email && password && typeof login === 'function') {
        const lr = await login(email, password);
        if (lr?.success) {
          return; // 홈 자동 진입
        }
        throw new Error(lr?.error || '자동 로그인에 실패했습니다.');
      }

      // 6) 최후: 세션이 없으면 로그인 화면으로 안내
      navigation.replace('Login');
    } catch (e) {
      console.warn('[ProfileSetup] complete error:', e?.message || e);
      Alert.alert('가입 처리 실패', e?.message || '잠시 후 다시 시도해주세요.');
      try {
        navigation.replace('Login');
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>마지막이에요!{'\n'}간단한 프로필을 완성해주세요.</Text>

      {/* 아바타 미리보기 (있으면 선택한 사진, 없으면 기본 이미지 표시) */}
      <TouchableOpacity onPress={pick} style={styles.avatarWrap} activeOpacity={0.9}>
        {photo?.uri ? (
          <Image source={{ uri: photo.uri }} style={styles.avatar} />
        ) : (
          <Image source={{ uri: DEFAULT_AVATAR_URL }} style={styles.avatar} />
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={pick} style={styles.photoBtn} activeOpacity={0.9}>
        <Text style={styles.photoBtnTxt}>{photo?.uri ? '다시 선택' : '사진 선택'}</Text>
      </TouchableOpacity>

      <InputOutlined
        value={bio}
        onChangeText={setBio}
        placeholder="자기소개를 간단히 작성해 주세요"
        multiline
        style={{ marginTop: 16 }}
      />

      <View style={styles.bottom}>
        <ButtonPrimary
          title={loading ? '처리 중...' : '시작하기'}
          onPress={handleComplete}
          // ✅ 사진이 없어도 진행 가능 (disabled 제거)
          disabled={loading}
        />
        <Text style={styles.helper}>
          프로필 사진은 나중에도 변경할 수 있어요.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:colors.background, paddingTop:40, paddingHorizontal:24 },
  title:{ fontSize:26, fontWeight:'800', textAlign:'center', color:colors.text, marginBottom:24 },
  avatarWrap:{ alignSelf:'center' },
  avatar:{ width:160, height:160, borderRadius:24, backgroundColor:'#EDF0F3' },
  photoBtn:{ marginTop:14, alignSelf:'center', paddingVertical:10, paddingHorizontal:20, borderRadius:24, borderWidth:2, borderColor:colors.primary },
  photoBtnTxt:{ color:colors.primary, fontWeight:'800', fontSize:16 },
  helper:{ marginTop:8, fontSize:12, color:colors.textSecondary, textAlign:'center' },
  bottom:{ marginTop:'auto', paddingVertical:16 },
});
