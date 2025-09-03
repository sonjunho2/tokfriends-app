// src/screens/auth/LocationScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import ButtonPrimary from '../../components/ButtonPrimary';

const AREAS = ['서울','인천','경기','강원','경상','부산','울산','대구','전라','광주','충청','대전','제주'];

export default function LocationScreen({ navigation, route }) {
  const [area, setArea] = useState(null);
  const next = () => {
    navigation.navigate('ProfileSetup', {
  ...route.params,   // email, password, birthYear, nickname, gender
  region: selectedRegion,
});


  return (
    <View style={styles.container}>
      <Text style={styles.title}>어디에 거주하시나요?</Text>
      <View style={styles.grid}>
        {AREAS.map((a) => (
          <TouchableOpacity
            key={a}
            style={[styles.item, area === a && styles.sel]}
            onPress={() => setArea(a)}
          >
            <Text style={[styles.itemTxt, area === a && styles.selTxt]}>{a}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.bottom}>
        <ButtonPrimary title="다음" onPress={next} disabled={!area} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor: colors.background, paddingTop:56, paddingHorizontal:24 },
  title:{ fontSize:26, fontWeight:'800', color: colors.text, textAlign:'center', marginBottom:12 },
  grid:{ flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', marginTop:8 },
  item:{ width:'48%', marginBottom:14, height:64, borderRadius:16, borderWidth:2, borderColor: colors.border, alignItems:'center', justifyContent:'center', backgroundColor:'#fff' },
  sel:{ borderColor: colors.primary, backgroundColor: (colors.primaryLight || '#FFD2DE') },
  itemTxt:{ fontWeight:'700', color: colors.text },
  selTxt:{ color: colors.primary },
  bottom:{ marginTop:'auto', paddingVertical:16 },
});
