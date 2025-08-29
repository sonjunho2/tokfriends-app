import React, { useRef, useEffect, useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../theme/colors';
import animations from '../theme/animations';

export default function ButtonPrimary({
  title,
  onPress,
  loading = false,
  disabled = false,
  size = 'medium',
  variant = 'gradient',
  icon,
  style,
  textStyle,
  glow = false,
  shimmer = false,
}) {
  const isDisabled = disabled || loading;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(-1)).current;
  const [buttonWidth, setButtonWidth] = useState(0);
  
  const sizeStyles = {
    small: { height: 44, paddingHorizontal: 20, fontSize: 14 },
    medium: { height: 56, paddingHorizontal: 28, fontSize: 16 },
    large: { height: 64, paddingHorizontal: 36, fontSize: 18 },
  };
  
  const currentSize = sizeStyles[size];

  useEffect(() => {
    if (glow && !isDisabled) {
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
  }, [glow, isDisabled]);

  useEffect(() => {
    if (shimmer && !isDisabled) {
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 2,
          duration: animations.timing.slow * 4,
          useNativeDriver: false,
        })
      ).start();
    }
  }, [shimmer, isDisabled]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: animations.scale.press,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const content = (
    <>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.textInverse} />
          <Text style={[styles.loadingText, { fontSize: currentSize.fontSize }]}>
            처리중...
          </Text>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[
            styles.text,
            { fontSize: currentSize.fontSize },
            textStyle
          ]}>
            {title}
          </Text>
        </View>
      )}
      
      {shimmer && !isDisabled && (
        <Animated.View
          style={[
            styles.shimmerOverlay,
            {
              transform: [{
                translateX: shimmerAnim.interpolate({
                  inputRange: [-1, 0, 1, 2],
                  outputRange: [-buttonWidth, -buttonWidth/2, buttonWidth/2, buttonWidth],
                })
              }],
            },
          ]}
        >
          <LinearGradient
            colors={colors.gradients.shimmer}
            style={styles.shimmerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </Animated.View>
      )}
    </>
  );
  
  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }] },
        style,
      ]}
      onLayout={(event) => setButtonWidth(event.nativeEvent.layout.width)}
    >
      {variant === 'gradient' && !isDisabled ? (
        <LinearGradient
          colors={colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.button,
            styles.gradientButton,
            { height: currentSize.height, paddingHorizontal: currentSize.paddingHorizontal },
          ]}
        >
          <TouchableOpacity
            style={styles.touchableArea}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={isDisabled}
            activeOpacity={0.9}
          >
            {content}
          </TouchableOpacity>
        </LinearGradient>
      ) : (
        <TouchableOpacity
          style={[
            styles.button,
            styles.solidButton,
            { height: currentSize.height, paddingHorizontal: currentSize.paddingHorizontal },
            isDisabled && styles.disabled,
          ]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isDisabled}
          activeOpacity={0.9}
        >
          {content}
        </TouchableOpacity>
      )}
      
      {glow && !isDisabled && (
        <Animated.View
          style={[
            styles.glowEffect,
            {
              opacity: glowAnim,
              height: currentSize.height,
            },
          ]}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  gradientButton: {
    borderWidth: 0,
  },
  solidButton: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.borderGlow,
  },
  disabled: {
    backgroundColor: colors.textTertiary,
    opacity: 0.6,
    borderColor: colors.border,
  },
  touchableArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  text: {
    color: colors.textInverse,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  loadingText: {
    color: colors.textInverse,
    fontWeight: '600',
    marginLeft: 12,
  },
  glowEffect: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 32,
    backgroundColor: 'transparent',
    shadowColor: colors.shadowGlow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 0,
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 100,
  },
  shimmerGradient: {
    flex: 1,
  },
});
