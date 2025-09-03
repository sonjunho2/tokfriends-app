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
  const { setUser } = useAuth?.() || {};
  const [photos, setPhotos] = useState([]);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const pick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const res = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection:true, selectionLimit:4, quality:0.8 });
    if (!res.canceled) setPhotos((res.assets || [res]).slice(0,4));
  };

  const handleComplete = async () => {
    if (loading) return;
    if (photos.length === 0) return Alert.alert('알림','프로필 사진을 최소 1장 등록해주세요.');

    setLoading(true);
    try {
      const payload = { ...route?.params, bio, photos: photos.map(p => ({ uri:p.uri })) };
      const resp = await apiClient.signup(payload); // 프로젝트 API 명에 맞게 조정

      const hasAutoLogin = resp?.token && resp?.user;
      if (hasAutoLogin && typeof setUser === 'function') {
        await markHasAccount();
        setUser({ ...resp.user, token: resp.token }); // → MainTabs 자동 진입
      } else {
        await markHasAccount();
        navigation.replace('Login');
      }
    } catch (e) {
      console.warn('[ProfileSetup] signup error:', e?.message || e);
      Alert.alert('가입 실패','잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const canStart = photos.length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>마지막이에요!{'\n'}간단한 프로필을 완성해주세요.</Text>

      <TouchableOpacity onPress={pick} style={styles.avatarWrap}>
        {photos[0] ? <Image source={{ uri: photos[0].uri }} style={styles.avatar} /> : <View style={styles.avatarPlaceholder} />}
      </TouchableOpacity>

      <TouchableOpacity onPress={pick} style={styles.photoBtn}>
        <Text style={styles.photoBtnTxt}>사진 등록</Text>
      </TouchableOpacity>

      <Text style={styles.counter}>{photos.length}/4 장</Text>

      <InputOutlined value={bio} onChangeText={setBio} placeholder="자기소개 작성" multiline style={{ marginTop:16 }} />

      <View style={styles.bottom}>
        <ButtonPrimary title={loading ? '처리 중...' : '시작하기'} disabled={!canStart || loading} onPress={handleComplete} />
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
