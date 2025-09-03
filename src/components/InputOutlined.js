// src/components/InputOutlined.js
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export default function InputOutlined({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  maxLength,
  multiline,
  style,
}) {
  return (
    <View style={[styles.wrap, style]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        keyboardType={keyboardType}
        maxLength={maxLength}
        multiline={multiline}
        style={[styles.input, multiline && { height: 140, textAlignVertical: 'top' }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 2,
    borderColor: '#E6E8EC',
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  input: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 18,
    color: '#111',
  },
});
