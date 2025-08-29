import React, { useRef, useEffect } from 'react';
import { View, Image, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../theme/colors';
import animations from '../theme/animations';

export default function Avatar({
  source,
  name,
  size = 'medium',
  online = false,
  showBorder = false,
  showGlow = false,
  animated = true,
  gradient = null,
  style,
}) {
  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const sizeMap = {
    tiny: 32,
    small: 48,
    medium: 64,
    large: 96,
    xlarge: 128,
  };
  
  const currentSize = typeof size === 'number' ? size : sizeMap[size] || sizeMap.medium;
  const dotSize = Math.max(12, currentSize * 0.22);
  const fontSize = currentSize * 0.3;
  
  useEffect(() => {
    if (showGlow) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: animations.timing.verySlow,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.4,
            duration: animations.timing.verySlow,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [showGlow]);

  useEffect(() => {
    if (online && animated) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: animations.timing.normal,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: animations.timing.normal,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [online, animated]);
  
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2).toUpperCase();
  };

  const avatarContent = source ? (
    <Image
      source={source}
      style={[
        styles.image,
        {
          width: currentSize,
          height: currentSize,
          borderRadius: currentSize / 2,
        },
      ]}
    />
  ) : gradient ? (
    <LinearGradient
      colors={colors.gradients[gradient] || gradient}
      style={[
        styles.gradient,
        {
          width: currentSize,
          height: currentSize,
          borderRadius: currentSize / 2,
        },
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={[styles.initials, { fontSize }]}>
        {getInitials(name)}
      </Text>
    </LinearGradient>
  ) : (
    <View
      style={[
        styles.placeholder,
        {
          width: currentSize,
          height: currentSize,
          borderRadius: currentSize / 2,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
  
  return (
    <View style={[{ width: currentSize, height: currentSize }, style]}>
      <View
        style={[
          styles.container,
          {
            width: currentSize,
            height: currentSize,
            borderRadius: currentSize / 2,
          },
          showBorder && styles.border,
        ]}
      >
        {avatarContent}
      </View>
      
      {showGlow && (
        <Animated.View
          style={[
            styles.glowEffect,
            {
              width: currentSize + 8,
              height: currentSize + 8,
              borderRadius: (currentSize + 8) / 2,
              top: -4,
              left: -4,
              opacity: glowAnim,
            },
          ]}
        />
      )}
      
      {online && (
        <Animated.View
          style={[
            styles.onlineDot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              bottom: currentSize * 0.05,
              right: currentSize * 0.05,
              transform: animated ? [{ scale: pulseAnim }] : [],
            },
          ]}
        >
          <LinearGradient
            colors={[colors.success, '#059669']}
            style={[
              styles.onlineGradient,
              {
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
              },
            ]}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundTertiary,
  },
  border: {
    borderWidth: 3,
    borderColor: colors.primary,
  },
  image: {
    resizeMode: 'cover',
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: colors.textInverse,
    fontWeight: '700',
    letterSpacing: 1,
  },
  onlineDot: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: colors.backgroundSecondary,
    shadowColor: colors.success,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  onlineGradient: {},
  glowEffect: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primaryGlow,
    shadowColor: colors.shadowGlow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 0,
  },
});
