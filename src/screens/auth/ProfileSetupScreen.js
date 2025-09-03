import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import colors from '../../theme/colors';
import InputOutlined from '../../components/InputOutlined';
import ButtonPrimary from '../../components/ButtonPrimary';

export default function ProfileSetupScreen({ navigation }) {
  const [photos, setPhotos] = useState([]);
  const [bio, setBio] = useState('');

  const pick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const res = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection:true, selectionLimit:4 });
    if (!res.canceled) {
      const list = (res.assets || [res]).slice(0, 4);
      setPhotos(list);
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
        <ButtonPrimary title="시작하기" disabled={!canStart} onPress={() => navigation.replace('HomeTabs')} />
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
