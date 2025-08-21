// src/components/ButtonPrimary.js
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../theme/colors';

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
}) {
  const isDisabled = disabled || loading;
  
  const sizeStyles = {
    small: { height: 40, paddingHorizontal: 16, fontSize: 14 },
    medium: { height: 52, paddingHorizontal: 24, fontSize: 16 },
    large: { height: 60, paddingHorizontal: 32, fontSize: 18 },
  };
  
  const currentSize = sizeStyles[size];
  
  const content = (
    <>
      {loading ? (
        <ActivityIndicator size="small" color={colors.textInverse} />
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
    </>
  );
  
  if (variant === 'gradient' && !isDisabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={style}
      >
        <LinearGradient
          colors={colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.button,
            { height: currentSize.height, paddingHorizontal: currentSize.paddingHorizontal },
          ]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles.solidButton,
        { height: currentSize.height, paddingHorizontal: currentSize.paddingHorizontal },
        isDisabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  solidButton: {
    backgroundColor: colors.primary,
  },
  disabled: {
    backgroundColor: colors.textTertiary,
    opacity: 0.5,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    color: colors.textInverse,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});