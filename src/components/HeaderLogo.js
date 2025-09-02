import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

export default function HeaderLogo({ size = 'medium', style }) {
  const height =
    typeof size === 'number'
      ? size
      : size === 'small'
      ? 20
      : size === 'large'
      ? 40
      : 28;

  const width = Math.round(height * 3.2);

  return (
    <View style={[styles.wrap, style]}>
      <Image
        source={require('../../assets/logo.png')}
        style={{ width, height, resizeMode: 'contain' }}
        accessible
        accessibilityLabel="딱친 로고"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center' },
});
