// src/components/Avatar.js
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export default function Avatar({
  source,
  name,
  size = 'medium',
  rounded = 14,        // ✅ 라운드값(디자인 통일)
  showBorder = false,
  online = false,
  style,
}) {
  const sizeMap = { tiny: 32, small: 40, medium: 64, large: 84, xlarge: 120 };
  const currentSize = typeof size === 'number' ? size : sizeMap[size] || sizeMap.medium;
  const dotSize = Math.max(10, Math.round(currentSize * 0.2));
  const fontSize = Math.round(currentSize * 0.32);

  const initials = (() => {
    if (!name) return '?';
    const s = String(name).trim();
    if (s.length <= 2) return s.toUpperCase();
    return s.slice(0, 2).toUpperCase();
  })();

  return (
    <View style={[{ width: currentSize, height: currentSize }, style]}>
      <View
        style={[
          styles.box,
          {
            width: currentSize,
            height: currentSize,
            borderRadius: rounded,
          },
          showBorder && styles.border,
        ]}
      >
        {source ? (
          <Image
            source={source}
            style={[
              styles.img,
              { width: currentSize, height: currentSize, borderRadius: rounded },
            ]}
          />
        ) : (
          <View
            style={[
              styles.placeholder,
              { width: currentSize, height: currentSize, borderRadius: rounded },
            ]}
          >
            <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
          </View>
        )}
      </View>

      {online && (
        <View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: Math.round(dotSize / 2),
              bottom: 2,
              right: 2,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.backgroundTertiary,
    overflow: 'hidden',
  },
  border: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  img: { resizeMode: 'cover' },
  placeholder: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { color: colors.textInverse, fontWeight: '700' },
  dot: {
    position: 'absolute',
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.backgroundSecondary,
  },
});
