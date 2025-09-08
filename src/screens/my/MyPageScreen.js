// src/screens/my/MyPageScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default function MyPageScreen() {
  return (
    <View style={s.c}>
      <Text style={s.t}>마이페이지</Text>
    </View>
  );
}

const s = StyleSheet.create({
  c:{ flex:1, alignItems:'center', justifyContent:'center', backgroundColor:colors.background },
  t:{ fontSize:18, color:colors.text, fontWeight:'700' },
});
