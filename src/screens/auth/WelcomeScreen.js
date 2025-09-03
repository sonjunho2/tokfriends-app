// src/screens/auth/WelcomeScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../theme/colors';

const HAS_ACCOUNT_KEY = 'HAS_ACCOUNT';

export default function WelcomeScreen({ navigation }) {
  useEffect(() => {
    (async () => {
      try {
        const has = await AsyncStorage.getItem(HAS_ACCOUNT_KEY);
        if (has === '1') {
          navigation.replace('Login');
        }
      } catch {}
    })();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MJ톡에 오신 걸 환영해요!</Text>
      <Text style={styles.sub}>새로운 친구, 지금 바로 시작해볼까요?</Text>

      {/* 시작하기 → Signup */}
      <TouchableOpacity style={[styles.btn, styles.primary]} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.primaryTxt}>시작하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, styles.outline]} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.outlineTxt}>이미 계정이 있어요</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, justifyContent:'center', alignItems:'center', padding:24, backgroundColor:colors.background },
  title:{ fontSize:28, fontWeight:'800', color:colors.text, textAlign:'center' },
  sub:{ marginTop:8, fontSize:14, color:colors.textSecondary, textAlign:'center' },
  btn:{ width:'100%', height:56, borderRadius:16, justifyContent:'center', alignItems:'center', marginTop:16 },
  primary:{ backgroundColor:colors.primary },
  primaryTxt:{ color:'#fff', fontWeight:'800', fontSize:18 },
  outline:{ backgroundColor:'#fff', borderWidth:2, borderColor:colors.primary },
  outlineTxt:{ color:colors.primary, fontWeight:'800', fontSize:18 },
});
