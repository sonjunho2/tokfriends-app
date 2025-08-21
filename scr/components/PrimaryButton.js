// tokfriends-app/src/components/PrimaryButton.js
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  fullWidth = true,
  style,
  ...props
}) {
  const isDisabled = disabled || loading;

  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    fullWidth && styles.fullWidth,
    isDisabled && styles.buttonDisabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFFFFF' : '#10B981'}
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  fullWidth: {
    width: '100%',
  },
  // Variants
  button_primary: {
    backgroundColor: '#10B981',
  },
  button_secondary: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
  },
  button_danger: {
    backgroundColor: '#EF4444',
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  // Sizes
  button_small: {
    height: 36,
    paddingHorizontal: 12,
  },
  button_medium: {
    height: 48,
    paddingHorizontal: 16,
  },
  button_large: {
    height: 56,
    paddingHorizontal: 20,
  },
  // Disabled state
  buttonDisabled: {
    opacity: 0.5,
  },
  // Text styles
  text: {
    fontFamily: 'NotoSansKR_700Bold',
  },
  text_primary: {
    color: '#FFFFFF',
  },
  text_secondary: {
    color: '#F3F4F6',
  },
  text_danger: {
    color: '#FFFFFF',
  },
  text_outline: {
    color: '#10B981',
  },
  text_small: {
    fontSize: 14,
  },
  text_medium: {
    fontSize: 16,
  },
  text_large: {
    fontSize: 18,
  },
});