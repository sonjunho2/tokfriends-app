// src/screens/chat/CreateChatRoomScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import Card from '../../components/Card';
import ButtonPrimary from '../../components/ButtonPrimary';
import { apiClient } from '../../api/client';

const CATEGORIES = [
  'HOT추천', '접속중', '가까운', '20대', '30대', '40대이상', '이성친구', '즉석만남',
];

export default function CreateChatRoomScreen({ navigation }) {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('알림', '방 제목을 입력해 주세요.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = { title: title.trim(), category };
      const room = await apiClient.createRoom(payload); // 안전 폴백 포함
      // 생성 성공 → 채팅방으로 진입
      navigation.replace('ChatRoom', { id: room?.id || Date.now(), title: room?.title || title });
    } catch (e) {
      Alert.alert('오류', e?.message || '방 생성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>채팅방 만들기</Text>
        <View style={{ width: 26 }} />
      </View>

      <Card style={styles.card}>
        <Text style={styles.label}>카테고리</Text>
        <View style={styles.pills}>
          {CATEGORIES.map((c) => {
            const on = c === category;
            return (
              <TouchableOpacity
                key={c}
                style={[styles.pill, on && styles.pillOn]}
                onPress={() => setCategory(c)}
              >
                <Text style={[styles.pillTxt, on && styles.pillTxtOn]}>{c}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.label, { marginTop: 16 }]}>방 제목</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="예) 30대 근처 사람들 자유 대화방"
          placeholderTextColor={colors.textTertiary}
          style={styles.input}
          autoCapitalize="none"
          maxLength={40}
        />

        <ButtonPrimary
          title="방 만들기"
          onPress={onSubmit}
          disabled={submitting}
          style={{ marginTop: 16 }}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor: colors.background },
  header:{
    flexDirection:'row', alignItems:'center', justifyContent:'space-between',
    paddingHorizontal:12, paddingVertical:10, backgroundColor: colors.backgroundSecondary,
    borderBottomWidth:1, borderBottomColor: colors.border
  },
  headerTitle:{ fontSize:22, fontWeight:'800', color: colors.text },

  card: { margin: 16, borderRadius: 16, padding: 16 },
  label: { fontSize: 14, fontWeight:'700', color: colors.text, marginBottom: 8 },

  pills: { flexDirection:'row', flexWrap:'wrap', gap: 8 },
  pill: {
    paddingVertical:8, paddingHorizontal:14, borderRadius:18,
    backgroundColor: colors.pillBg, borderWidth:1, borderColor: colors.border
  },
  pillOn: { backgroundColor: colors.pillActiveBg, borderColor: colors.pillActiveBorder },
  pillTxt: { color: colors.textSecondary, fontWeight:'700' },
  pillTxtOn: { color: colors.primary },

  input: {
    backgroundColor: '#fff', borderWidth:1, borderColor: colors.border, borderRadius:12,
    paddingHorizontal:14, paddingVertical:12, fontSize:16, color: colors.text
  },
});
