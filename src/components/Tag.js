// src/components/Tag.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export default function Tag({
  label,
  selected = false,
  onPress,
  size = 'medium',
  style,
}) {
  const sizeStyles = {
    small: { tag: styles.tagSmall, text: styles.textSmall },
    medium: { tag: styles.tagMedium, text: styles.textMedium },
    large: { tag: styles.tagLarge, text: styles.textLarge },
  };

  const currentSize = sizeStyles[size] || sizeStyles.medium;

  return (
    <TouchableOpacity
      style={[
        styles.tag,
        currentSize.tag,
        selected && styles.tagSelected,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.text,
          currentSize.text,
          selected && styles.textSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tagSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  tagSmall: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagMedium: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tagLarge: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  text: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  textSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  textSmall: {
    fontSize: 12,
  },
  textMedium: {
    fontSize: 14,
  },
  textLarge: {
    fontSize: 16,
  },
});
