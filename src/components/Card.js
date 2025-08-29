import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../theme/colors';
import animations from '../theme/animations';

export default function Card({
  children,
  onPress,
  padding = 20,
  margin = 0,
  borderRadius = 24,
  shadow = true,
  glass = false,
  glow = false,
  gradient = null,
  style,
  animated = true,
  ...props
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (glow) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: animations.timing.verySlow,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: animations.timing.verySlow,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [glow]);

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

  const cardStyle = [
    styles.card,
    shadow && (glass ? styles.glassShadow : styles.normalShadow),
    glass && styles.glass,
    glow && styles.glow,
    {
      padding,
      margin,
      borderRadius,
      transform: animated ? [{ scale: scaleAnim }] : [],
    },
    style,
  ];

  const content = <View style={styles.content}>{children}</View>;

  if (gradient) {
    return (
      <Animated.View style={cardStyle}>
        <LinearGradient
          colors={colors.gradients[gradient] || gradient}
          style={[styles.gradient, { borderRadius }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {onPress ? (
            <TouchableOpacity
              style={[styles.touchable, { borderRadius }]}
              onPress={onPress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
              {...props}
            >
              {content}
            </TouchableOpacity>
          ) : (
            content
          )}
        </LinearGradient>
        {glow && (
          <Animated.View
            style={[
              styles.glowEffect,
              {
                borderRadius,
                opacity: glowAnim,
              },
            ]}
          />
        )}
      </Animated.View>
    );
  }

  if (onPress) {
    return (
      <Animated.View style={cardStyle}>
        <TouchableOpacity
          style={[styles.touchable, { borderRadius }]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
          {...props}
        >
          {content}
        </TouchableOpacity>
        {glow && (
          <Animated.View
            style={[
              styles.glowEffect,
              {
                borderRadius,
                opacity: glowAnim,
              },
            ]}
          />
        )}
      </Animated.View>
    );
  }
  
  return (
    <Animated.View style={cardStyle}>
      {content}
      {glow && (
        <Animated.View
          style={[
            styles.glowEffect,
            {
              borderRadius,
              opacity: glowAnim,
            },
          ]}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  glass: {
    backgroundColor: colors.backgroundGlass,
    backdropFilter: 'blur(20px)',
    borderColor: colors.borderGlow,
  },
  content: {
    flex: 1,
  },
  touchable: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  normalShadow: {
    shadowColor: colors.shadowSecondary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  glassShadow: {
    shadowColor: colors.shadowPrimary,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 16,
  },
  glow: {
    position: 'relative',
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
    shadowRadius: 20,
    elevation: 0,
  },
});
