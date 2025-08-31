import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

export default function ButtonPrimary({
  title,
  onPress,
  loading = false,
  disabled = false,
  size = 'medium',
  variant = 'filled',
  icon,
  style,
  textStyle,
}) {
  const isDisabled = disabled || loading;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const sizeStyles = {
    small: { height: 40, paddingHorizontal: 16, fontSize: 14 },
    medium: { height: 48, paddingHorizontal: 20, fontSize: 16 },
    large: { height: 56, paddingHorizontal: 24, fontSize: 16 },
  };
  
  const currentSize = sizeStyles[size];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyle = () => {
    if (isDisabled) {
      return [styles.button, styles.disabled];
    }
    
    switch (variant) {
      case 'outline':
        return [styles.button, styles.outline];
      case 'text':
        return [styles.button, styles.text];
      default:
        return [styles.button, styles.filled];
    }
  };

  const getTextStyle = () => {
    if (isDisabled) {
      return [styles.buttonText, styles.disabledText, { fontSize: currentSize.fontSize }];
    }
    
    switch (variant) {
      case 'outline':
        return [styles.buttonText, styles.outlineText, { fontSize: currentSize.fontSize }];
      case 'text':
        return [styles.buttonText, styles.textOnly, { fontSize: currentSize.fontSize }];
      default:
        return [styles.buttonText, styles.filledText, { fontSize: currentSize.fontSize }];
    }
  };
  
  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        style={[
          ...getButtonStyle(),
          {
            height: currentSize.height,
            paddingHorizontal: currentSize.paddingHorizontal,
          },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={1}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator 
              size="small" 
              color={variant === 'filled' ? colors.textInverse : colors.primary} 
            />
            <Text style={[getTextStyle(), { marginLeft: 8 }]}>처리중...</Text>
          </View>
        ) : (
          <View style={styles.contentContainer}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={[getTextStyle(), textStyle]}>
              {title}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  filled: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  text: {
    backgroundColor: 'transparent',
  },
  disabled: {
    backgroundColor: colors.textTertiary,
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
    marginRight: 8,
  },
  buttonText: {
    fontWeight: '700',
  },
  filledText: {
    color: colors.textInverse,
  },
  outlineText: {
    color: colors.primary,
  },
  textOnly: {
    color: colors.primary,
  },
  disabledText: {
    color: colors.textInverse,
  },
});
