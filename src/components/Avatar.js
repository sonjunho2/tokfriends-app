// src/components/Avatar.js
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export default function Avatar({
  source,
  name,
  size = 'medium',
  online = false,
  showBorder = false,
  style,
}) {
  const sizeMap = {
    tiny: 40,     // 🔄 탐색/추천에서도 최소 40px
    small: 60,    // 🔄 조금 더 큼직하게
    medium: 80,   // 🔄 기본 아바타는 80px
    large: 100,
    xlarge: 120,
  };

  const currentSize = typeof size === 'number' ? size : sizeMap[size] || sizeMap.medium;
  const dotSize = Math.max(12, currentSize * 0.25);
  const fontSize = currentSize * 0.35;

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <View style={[{ width: currentSize, height: currentSize }, style]}>
      <View
        style={[
          styles.container,
          {
            width: currentSize,
            height: currentSize,
            borderRadius: 16, // ✅ 탐색/추천과 동일한 사각 라운드
          },
          showBorder && styles.border,
        ]}
      >
        {source ? (
          <Image
            source={source}
            style={[
              styles.image,
              {
                width: currentSize,
                height: currentSize,
                borderRadius: 16, // ✅ 동일
              },
            ]}
          />
        ) : (
          <View
            style={[
              styles.placeholder,
              {
                width: currentSize,
                height: currentSize,
                borderRadius: 16, // ✅ 동일
              },
            ]}
          >
            <Text style={[styles.initials, { fontSize }]}>
              {getInitials(name)}
            </Text>
          </View>
        )}
      </View>

      {online && (
        <View
          style={[
            styles.onlineDot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              bottom: 4,
              right: 4,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  border: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: colors.text,
    fontWeight: '700',
  },
  onlineDot: {
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.backgroundSecondary,
    position: 'absolute',
  },
});
