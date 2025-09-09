// src/screens/explore/ExploreScreen.js
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import UserListItem from '../../components/UserListItem';

const SEGMENTS = ['HOT추천', '내주변', '접속중', '단순대화'];

export default function ExploreScreen({ navigation }) {
  const [seg, setSeg] = useState(0);

  const data = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: ['은별', '아라', '사라', '윤아', '나리'][i % 5],
        age: [22, 27, 31, 29, 34][i % 5],
        points: [0, 30, 5, 80, 0][i % 5],
        subtitle: '대화해요!',
        avatar: `https://i.pravatar.cc/150?img=${(i % 60) + 1}`,
        lastSeenLabel: ['방금', '1시간', '17시간', '2일', '6시간'][i % 5],
        regionLabel: ['서울', '부산', '대전', '울산', '서울'][i % 5],
        distanceKm: [3, 18, 42, 5, 16][i % 5],
      })),
    [seg]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>탐색</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.segWrap}>
        {SEGMENTS.map((label, i) => {
          const on = i === seg;
          return (
            <TouchableOpacity key={label} style={[styles.seg, on && styles.segOn]} onPress={() => setSeg(i)}>
              <Text style={[styles.segTxt, on && styles.segTxtOn]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={data}
        keyExtractor={(it) => String(it.id)}
        renderItem={({ item }) => <UserListItem item={item} onPress={() => {}} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, paddingTop: 4 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
  segWrap: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 14 },
  seg: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: colors.pillBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segOn: { backgroundColor: colors.pillActiveBg, borderColor: colors.pillActiveBorder },
  segTxt: { color: colors.textSecondary, fontWeight: '700' },
  segTxtOn: { color: colors.primary },
});
