// src/components/ButtonPrimary.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import colors from '../theme/colors';

export default function ButtonPrimary({
  title,
  onPress,
  disabled,
  style,
  variant = 'primary', // 'primary' | 'outline'
}) {
  const isOutline = variant === 'outline';
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.btn,
        isOutline ? styles.outline : styles.primary,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.txt,
          isOutline ? { color: colors.primary } : { color: '#fff' },
          disabled && { opacity: 0.7 },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primary: { backgroundColor: colors.primary },
  outline: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  txt: { fontSize: 18, fontWeight: '700' },
  disabled: { backgroundColor: '#F1F2F4' },
});
