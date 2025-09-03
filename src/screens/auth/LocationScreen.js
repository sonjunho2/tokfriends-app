import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import ButtonPrimary from '../../components/ButtonPrimary';
import ChoiceButton from '../../components/ChoiceButton';

const AREAS = ['서울','인천','경기','강원','경상','부산','울산','대구','전라','광주','충청','대전','제주'];

export default function LocationScreen({ navigation }) {
  const [area, setArea] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>어디에 거주하시나요?</Text>
      <View style={styles.grid}>
        {AREAS.map((a) => (
          <ChoiceButton key={a} label={a} selected={area === a} onPress={() => setArea(a)} style={styles.item} />
        ))}
      </View>
      <View style={styles.bottom}>
        {/* ❗ 여기서 Agreement로 가던 문제를 ProfileSetup으로 수정 */}
        <ButtonPrimary title="다음" onPress={() => navigation.navigate('ProfileSetup')} disabled={!area} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor: colors.background, paddingTop:56, paddingHorizontal:24 },
  title:{ fontSize:28, fontWeight:'800', color: colors.text, textAlign:'center', marginBottom:16 },
  grid:{ flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', marginTop:8 },
  item:{ width:'48%', marginBottom:14, height:64 },
  bottom:{ marginTop:'auto', paddingVertical:16 },
});
