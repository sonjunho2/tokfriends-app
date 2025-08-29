import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../theme/colors';
import animations from '../theme/animations';

export default function Tag({
  label,
  onPress,
  color = 'primary',
  size = 'small',
  selected = false,
  animated = true,
  glow = false,
  gradient = false,
  style,
  textStyle,
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  const colorMap = {
    primary: {
      bg: selected ? colors.primary : colors.primaryGlow,
      text: selected ? colors.textInverse : colors.primary,
      gradientColors: colors.gradients.primary,
    },
    accent: {
      bg: selected ? colors.accent : colors.accentGlow,
      text: selected ? colors.textInverse : colors.accent,
      gradientColors: colors.gradients.accent,
    },
    success: {
      bg: selected ? colors.success : colors.successGlow,
      text: selected ? colors.textInverse : colors.success,
      gradientColors: [colors.success, '#059669'],
    },
    neutral: {
      bg: selected ? colors.text : colors.backgroundTertiary,
      text: selected ? colors.textInverse : colors.textSecondary,
      gradientColors: colors.gradients.glass,
    },
  };
  
  const sizeMap = {
    tiny: { paddingH: 10, paddingV: 6, fontSize: 11, borderRadius: 12 },
    small: { paddingH: 16, paddingV: 8, fontSize: 12, borderRadius: 16 },
    medium: { paddingH: 20, paddingV: 12, fontSize: 14, borderRadius: 20 },
    large: { paddingH: 24, paddingV: 16, fontSize: 16, borderRadius: 24 },
  };
  
  const currentColor = colorMap[color] || colorMap.primary;
  const currentSize = sizeMap[size] || sizeMap.small;

  useEffect(() => {
    if (glow && selected) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: animations.timing.slow,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: animations.timing.slow,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [glow, selected]);

  const handlePressIn = () => {
    if (animated && onPress) {
      Animated.spring(scaleAnim, {
        toValue: animations.scale.press,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (animated && onPress) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };
  
  const Component = onPress ? TouchableOpacity : View;
  const isGradient = gradient && selected;

  const content = (
    <Text
      style={[
        styles.text,
        {
          color: currentColor.text,
          fontSize: currentSize.fontSize,
        },
        textStyle,
      ]}
    >
      {label}
    </Text>
  );

  return (
    <Animated.View
      style={[
        { transform: animated ? [{ scale: scaleAnim }] : [] },
        style,
      ]}
    >
      {isGradient ? (
        <LinearGradient
          colors={currentColor.gradientColors}
          style={[
            styles.tag,
            styles.gradientTag,
            {
              paddingHorizontal: currentSize.paddingH,
              paddingVertical: currentSize.paddingV,
              borderRadius: currentSize.borderRadius,
            },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Component
            style={styles.touchableArea}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
          >
            {content}
          </Component>
        </LinearGradient>
      ) : (
        <Component
          style={[
            styles.tag,
            {
              backgroundColor: currentColor.bg,
              paddingHorizontal: currentSize.paddingH,
              paddingVertical: currentSize.paddingV,
              borderRadius: currentSize.borderRadius,
            },
            selected && styles.selected,
          ]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
        >
          {content}
        </Component>
      )}
      
      {glow && selected && (
        <Animated.View
          style={[
            styles.glowEffect,
            {
              borderRadius: currentSize.borderRadius + 4,
              opacity: glowAnim,
            },
          ]}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
  },
  gradientTag: {
    borderWidth: 0,
  },
  selected: {
    borderColor: colors.borderGlow,
    shadowColor: colors.shadowPrimary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  touchableArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  glowEffect: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primaryGlow,
    shadowColor: colors.shadowGlow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 0,
  },
});
