import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import colors from '../../theme/colors';
import InputOutlined from '../../components/InputOutlined';
import ButtonPrimary from '../../components/ButtonPrimary';
import { markHasAccount } from '../../utils/accountFlag';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client'; // ← 실제 프로젝트의 회원가입 API 클라이언트

export default function ProfileSetupScreen({ navigation, route }) {
  const { setUser } = useAuth?.() || {};
  const [photos, setPhotos] = useState([]);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const pick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const res = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      selectionLimit: 4,
      quality: 0.8,
    });
    if (!res.canceled) {
      const list = (res.assets || [res]).slice(0, 4);
      setPhotos(list);
    }
  };

  /** ✅ 가입 완료(제출) */
  const handleComplete = async () => {
    if (loading) return;
    if (photos.length === 0) {
      Alert.alert('알림', '프로필 사진을 최소 1장 등록해주세요.');
      return;
    }

    setLoading(true);
    try {
      // 1) 서버에 가입 완료(프로필 포함) 요청
      //    - 실제 API 스펙에 맞게 payload 구성하세요.
      //    - 예시: route.params에 이전 단계에서 모아온 가입 정보가 들어있다고 가정
      const payload = {
        ...route?.params, // { email, password, age, gender, location, nickname ... }
        bio,
        photos: photos.map(p => ({ uri: p.uri })), // 서버가 S3 업로드 URL을 주는 구조면 거기에 맞게 변경
      };

      // 실제 프로젝트의 API 이름으로 바꾸세요. (예: apiClient.signup, apiClient.completeSignup 등)
      const resp = await apiClient.signup(payload);

      // 2) 자동 로그인 가능한 응답인지 판별 (토큰/유저 포함 시)
      const hasAutoLogin = resp?.token && resp?.user;

      if (hasAutoLogin && typeof setUser === 'function') {
        // 2-A) 자동 로그인 경로: 앱 상태에 유저 저장 → 플래그 저장 → 홈으로
        await markHasAccount();                      // ★ 바로 여기 (성공 직후)
        setUser({ ...resp.user, token: resp.token }); // AuthContext 업데이트
        // RootNavigator가 user 감지 → 자동으로 MainTabs로 진입
      } else {
        // 2-B) 자동 로그인 불가: 플래그만 저장하고, 로그인 화면으로 이동
        await markHasAccount();                      // ★ 바로 여기 (성공 직후)
        navigation.replace('Login');                 // Welcome은 플래그 보고 Login으로 자동 이동
      }
    } catch (e) {
      console.warn('[ProfileSetup] signup error:', e?.message || e);
      Alert.alert('가입 실패', '잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const canStart = photos.length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>마지막이에요!{'\n'}간단한 프로필을 완성해주세요.</Text>

      <TouchableOpacity onPress={pick} style={styles.avatarWrap}>
        {photos[0] ? (
          <Image source={{ uri: photos[0].uri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={pick} style={styles.photoBtn}>
        <Text style={styles.photoBtnTxt}>사진 등록</Text>
      </TouchableOpacity>

      <Text style={styles.counter}>{photos.length}/4 장</Text>

      <InputOutlined
        value={bio}
        onChangeText={setBio}
        placeholder="자기소개 작성"
        multiline
        style={{ marginTop: 16 }}
      />

      <View style={styles.bottom}>
        <ButtonPrimary
          title={loading ? '처리 중...' : '시작하기'}
          disabled={!canStart || loading}
          onPress={handleComplete}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:colors.background, paddingTop:40, paddingHorizontal:24 },
  title:{ fontSize:26, fontWeight:'800', textAlign:'center', color:colors.text, marginBottom:24 },
  avatarWrap:{ alignSelf:'center' },
  avatar:{ width:160, height:160, borderRadius:24 },
  avatarPlaceholder:{
    width:160, height:160, borderRadius:24,
    backgroundColor:'#EDF0F3', borderWidth:2, borderColor:'#E4E7EC'
  },
  photoBtn:{ marginTop:14, alignSelf:'center', paddingVertical:10, paddingHorizontal:20, borderRadius:24, borderWidth:2, borderColor:colors.primary },
  photoBtnTxt:{ color:colors.primary, fontWeight:'800', fontSize:16 },
  counter:{ alignSelf:'flex-end', marginTop:10, color:colors.textSecondary },
  bottom:{ marginTop:'auto', paddingVertical:16 },
});
