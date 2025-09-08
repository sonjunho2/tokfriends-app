// src/screens/shop/ShopScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default function ShopScreen() {
  return (
    <View style={s.c}>
      <Text style={s.t}>상점 준비중</Text>
    </View>
  );
}

const s = StyleSheet.create({
  c:{ flex:1, alignItems:'center', justifyContent:'center', backgroundColor:colors.background },
  t:{ fontSize:18, color:colors.text, fontWeight:'700' },
});
