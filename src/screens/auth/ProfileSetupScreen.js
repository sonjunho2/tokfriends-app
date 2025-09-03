import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import colors from '../../theme/colors';
import InputOutlined from '../../components/InputOutlined';
import ButtonPrimary from '../../components/ButtonPrimary';
import { markHasAccount } from '../../utils/accountFlag';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';

export default function ProfileSetupScreen({ navigation, route }) {
  const { setUser, login } = useAuth?.() || {};
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

  /** 가입 완료 → 반드시 홈으로 진입 */
  const handleComplete = async () => {
    if (loading) return;
    if (photos.length === 0) {
      Alert.alert('알림', '프로필 사진을 최소 1장 등록해주세요.');
      return;
    }

    setLoading(true);
    try {
      // 1) 가입 요청 (이전 단계에서 모은 값이 route.params에 담겨 있다고 가정)
      const payload = {
        ...route?.params, // { email, password, age, gender, location, nickname ... }
        bio,
        photos: photos.map(p => ({ uri: p.uri })),
      };

      const resp = await apiClient.signup(payload);

      // 2) 가입 성공 플래그 (Welcome이 자동으로 Login으로 가도록)
      await markHasAccount();

      // 3) 자동 로그인 가능한 응답이면 즉시 세션 세팅 → RootNavigator가 MainTabs로 전환
      if (resp?.token && resp?.user && typeof setUser === 'function') {
        setUser({ ...resp.user, token: resp.token });
        return; // 여기서 끝 (홈으로 자동 전환)
      }

      // 4) 응답에 토큰/유저가 없으면: 가입 이메일/비번으로 자동 로그인 시도
      const email = payload?.email?.trim?.() || '';
      const password = payload?.password || '';
      if (email && password && typeof login === 'function') {
        const lr = await login(email, password);
        if (lr?.success) {
          // RootNavigator가 user 감지 → 홈 자동 진입
          return;
        }
        // 로그인 실패 시 명확한 메시지
        throw new Error(lr?.error || '자동 로그인에 실패했습니다.');
      }

      // 5) 여기까지 오면 홈 진입 실패
      throw new Error('자동 로그인 정보를 찾을 수 없습니다. 로그인 화면에서 다시 시도해주세요.');
    } catch (e) {
      console.warn('[ProfileSetup] complete error:', e?.message || e);
      Alert.alert(
        '가입 처리 실패',
        e?.message || '잠시 후 다시 시도해주세요.'
      );
      // 최후 수단으로 로그인 화면으로 안내(세션 없이는 MainTabs 진입 불가)
      try {
        navigation.replace('Login');
      } catch (_) {}
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
  avatarPlaceholder:{ width:160, height:160, borderRadius:24, backgroundColor:'#EDF0F3', borderWidth:2, borderColor:'#E4E7EC' },
  photoBtn:{ marginTop:14, alignSelf:'center', paddingVertical:10, paddingHorizontal:20, borderRadius:24, borderWidth:2, borderColor:colors.primary },
  photoBtnTxt:{ color:colors.primary, fontWeight:'800', fontSize:16 },
  counter:{ alignSelf:'flex-end', marginTop:10, color:colors.textSecondary },
  bottom:{ marginTop:'auto', paddingVertical:16 },
});
