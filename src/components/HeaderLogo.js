import React, { useRef, useEffect } from 'react';
import { Image, View, StyleSheet, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../theme/colors';
import animations from '../theme/animations';

export default function HeaderLogo({ size = 'medium', animated = false, style }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const height =
    typeof size === 'number'
      ? size
      : size === 'small'
      ? 32
      : size === 'large'
      ? 48
      : 36;

  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: animations.timing.verySlow * 3,
          useNativeDriver: true,
        })
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: animations.timing.verySlow,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: animations.timing.verySlow,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [animated]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.logoContainer}>
        <LinearGradient
          colors={colors.gradients.primary}
          style={[
            styles.logoBackground,
            {
              width: height * 1.2,
              height: height,
              borderRadius: height / 2,
            },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View
            style={[
              styles.logoContent,
              animated && {
                transform: [{ rotate: rotateInterpolate }],
              },
            ]}
          >
            <Text style={[styles.logoText, { fontSize: height * 0.4 }]}>딱</Text>
          </Animated.View>
        </LinearGradient>
        
        {animated && (
          <Animated.View
            style={[
              styles.glowEffect,
              {
                width: height * 1.4,
                height: height * 1.2,
                borderRadius: (height * 1.2) / 2,
                opacity: glowAnim,
              },
            ]}
          />
        )}
      </View>
      
      <Text style={[styles.brandText, { fontSize: height * 0.5 }]}>친</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'relative',
    marginRight: 4,
  },
  logoBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadowPrimary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: colors.textInverse,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  brandText: {
    color: colors.primary,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  glowEffect: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
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
