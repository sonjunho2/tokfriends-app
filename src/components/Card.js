import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import colors from '../theme/colors';

export default function Card({
  children,
  onPress,
  padding = 16,
  margin = 0,
  borderRadius = 12,
  shadow = true,
  style,
  ...props
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
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

  const cardStyle = [
    styles.card,
    shadow && styles.shadow,
    {
      padding,
      margin,
      borderRadius,
      transform: [{ scale: scaleAnim }],
    },
    style,
  ];

  if (onPress) {
    return (
      <Animated.View style={cardStyle}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          {...props}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  }
  
  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundSecondary,
  },
  shadow: {
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  touchable: {
    flex: 1,
  },
});
