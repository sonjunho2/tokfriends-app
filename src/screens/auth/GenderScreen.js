import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import ButtonPrimary from '../../components/ButtonPrimary';
import ChoiceButton from '../../components/ChoiceButton';

export default function GenderScreen({ navigation }) {
  const [gender, setGender] = useState(null);
  const isValid = !!gender;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>성별을 선택해주세요.</Text>
      <View style={styles.row}>
        <ChoiceButton label="남성" selected={gender === 'M'} onPress={() => setGender('M')} style={styles.cell} />
        <ChoiceButton label="여성" selected={gender === 'F'} onPress={() => setGender('F')} style={styles.cell} />
      </View>
      <View style={styles.bottom}>
        <ButtonPrimary title="다음" onPress={() => navigation.navigate('Location')} disabled={!isValid} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor: colors.background, paddingTop:56, paddingHorizontal:24 },
  title:{ fontSize:28, fontWeight:'800', color: colors.text, textAlign:'center', marginBottom:28 },
  row:{ flexDirection:'row', gap:16 },
  cell:{ flex:1 },
  bottom:{ marginTop:'auto', paddingVertical:16 },
});
