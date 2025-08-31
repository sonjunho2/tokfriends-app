import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import colors from '../theme/colors';

export default function Tag({
  label,
  onPress,
  color = 'primary',
  size = 'small',
  selected = false,
  style,
  textStyle,
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const colorMap = {
    primary: {
      bg: selected ? colors.primary : colors.backgroundTertiary,
      text: selected ? colors.textInverse : colors.textSecondary,
    },
    neutral: {
      bg: selected ? colors.text : colors.backgroundTertiary,
      text: selected ? colors.textInverse : colors.textSecondary,
    },
  };
  
  const sizeMap = {
    tiny: { paddingH: 8, paddingV: 4, fontSize: 11 },
    small: { paddingH: 12, paddingV: 6, fontSize: 12 },
    medium: { paddingH: 16, paddingV: 8, fontSize: 14 },
  };
  
  const currentColor = colorMap[color] || colorMap.primary;
  const currentSize = sizeMap[size] || sizeMap.small;

  const handlePressIn = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };
  
  const Component = onPress ? TouchableOpacity : View;
  
  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Component
        style={[
          styles.tag,
          {
            backgroundColor: currentColor.bg,
            paddingHorizontal: currentSize.paddingH,
            paddingVertical: currentSize.paddingV,
          },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
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
      </Component>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tag: {
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});
