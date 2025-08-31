import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export default function HeaderLogo({ size = 'medium', style }) {
  const height = typeof size === 'number' ? size : size === 'small' ? 24 : size === 'large' ? 36 : 28;

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.logoBackground, { width: height * 1.2, height: height }]}>
        <Text style={[styles.logoText, { fontSize: height * 0.5 }]}>딱</Text>
      </View>
      <Text style={[styles.brandText, { fontSize: height * 0.6 }]}>친</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBackground: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  logoText: {
    color: colors.textInverse,
    fontWeight: '800',
  },
  brandText: {
    color: colors.text,
    fontWeight: '800',
  },
});
