// src/screens/shop/ShopScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
export default function ShopScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>상점 (준비중)</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex:1, alignItems:'center', justifyContent:'center', backgroundColor: colors.background },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
});
