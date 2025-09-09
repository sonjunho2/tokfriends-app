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
  shape = 'circle', // 'circle' | 'rounded'
  style,
}) {
  const sizeMap = { tiny: 32, small: 40, medium: 56, large: 80, xlarge: 120 };
  const currentSize = typeof size === 'number' ? size : sizeMap[size] || sizeMap.medium;
  const dotSize = Math.max(12, currentSize * 0.25);
  const fontSize = currentSize * 0.35;

  const radius = shape === 'rounded' ? Math.max(8, Math.round(currentSize * 0.2)) : currentSize / 2;

  const getInitials = (n) => {
    if (!n) return '?';
    const parts = String(n).trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return n.substring(0, 2).toUpperCase();
  };

  return (
    <View style={[{ width: currentSize, height: currentSize }, style]}>
      <View
        style={[
          styles.container,
          { width: currentSize, height: currentSize, borderRadius: radius },
          showBorder && styles.border,
        ]}
      >
        {source ? (
          <Image
            source={source}
            style={[styles.image, { width: currentSize, height: currentSize, borderRadius: radius }]}
          />
        ) : (
          <View
            style={[styles.placeholder, { width: currentSize, height: currentSize, borderRadius: radius }]}
          >
            <Text style={[styles.initials, { fontSize }]}>{getInitials(name)}</Text>
          </View>
        )}
      </View>

      {online && (
        <View
          style={[
            styles.onlineDot,
            { width: dotSize, height: dotSize, borderRadius: dotSize / 2, bottom: currentSize * 0.05, right: currentSize * 0.05 },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.backgroundTertiary },
  border: { borderWidth: 2, borderColor: colors.primary },
  image: { resizeMode: 'cover' },
  placeholder: { backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  initials: { color: colors.textInverse, fontWeight: '600' },
  onlineDot: { backgroundColor: colors.success, borderWidth: 2, borderColor: colors.backgroundSecondary, position: 'absolute' },
});
