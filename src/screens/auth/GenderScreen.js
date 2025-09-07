// src/screens/auth/GenderScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import ButtonPrimary from '../../components/ButtonPrimary';

export default function GenderScreen({ navigation, route }) {
  const [gender, setGender] = useState(null);
  const isValid = !!gender;

  const next = () => {
    navigation.navigate('Location', {
      ...route.params, // email, password, birthYear, nickname
      gender,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>성별을 선택해 주세요</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.cell, gender === 'male' && styles.sel]}
          onPress={() => setGender('male')}
        >
          <Text style={[styles.cellTxt, gender === 'male' && styles.selTxt]}>남성</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cell, gender === 'female' && styles.sel]}
          onPress={() => setGender('female')}
        >
          <Text style={[styles.cellTxt, gender === 'female' && styles.selTxt]}>여성</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottom}>
        <ButtonPrimary title="다음" onPress={next} disabled={!isValid} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 56, paddingHorizontal: 24 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, textAlign: 'center', marginBottom: 16 },
  row: { flexDirection: 'row', gap: 16 },
  cell: { flex: 1, backgroundColor: '#fff', borderWidth: 2, borderColor: colors.border, borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  sel: { borderColor: colors.primary, backgroundColor: (colors.primaryLight || '#FFD2DE') },
  cellTxt: { fontWeight: '700', color: colors.text },
  selTxt: { color: colors.primary },
  bottom: { marginTop: 'auto', paddingVertical: 16 },
});
