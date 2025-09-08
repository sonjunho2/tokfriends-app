// src/screens/my/MyPageScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
export default function MyPageScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>마이페이지 (준비중)</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex:1, alignItems:'center', justifyContent:'center', backgroundColor: colors.background },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
});
