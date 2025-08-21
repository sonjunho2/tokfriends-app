// src/components/HeaderLogo.js
import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

// 딱친 로고 이미지 헤더 컴포넌트
// size: 'sm' | 'md' | 'lg' | number(px 높이). 기본 'md'
export default function HeaderLogo({ size = 'md', style }) {
  const height =
    typeof size === 'number'
      ? size
      : size === 'sm'
      ? 20
      : size === 'lg'
      ? 40
      : 28; // 'md'

  // 가로세로 비율은 로고에 맞게 적당히 3.2:1 정도로 잡아줍니다.
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
