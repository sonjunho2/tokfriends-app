// src/screens/main/ChatsScreen.js
import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import ChatListItem from '../../components/ChatListItem';

const SEGMENTS = ['전체', '읽지 않음', '신규', '즐겨찾기'];

export default function ChatsScreen({ navigation, route }) {
  const [seg, setSeg] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [roomTitle, setRoomTitle] = useState('');
  const [roomType, setRoomType] = useState('일반채팅');

  const data = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: ['여행', '수별', '같이', '포에', '시얏'][i % 5],
        avatar: `https://i.pravatar.cc/150?img=${(i % 60) + 1}`,
        preview: ['주말에 시간 괜찮으세요?', '사진 고마워요 :)', '네! 확인했습니다', '헬스 같이 하실래요?', '안녕하세요!'][i % 5],
        lastSeenLabel: ['4분', '1시간', '17시간', '2일', '6시간'][i % 5],
        regionLabel: ['서울', '대전', '대전', '울산', '서울'][i % 5],
        distanceKm: [7, 132, 270, 22, 233][i % 5],
        unread: [2, 0, 1, 0, 3][i % 5],
        online: [true, false, true, false, false][i % 5],
        pinned: i % 7 === 0,
        age: [23, 27, 21, 29, 24][i % 5],
        points: [0, 10, 0, 0, 5][i % 5],
      })),
    [seg]
  );

  return (
    <View style={styles.container}>
      {/* 중앙 타이틀 + 우측 + 버튼 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>대화</Text>
        <TouchableOpacity onPress={() => setShowCreate(true)} hitSlop={8}>
          <Ionicons name="add" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* 세그먼트 */}
      <View style={styles.segWrap}>
        {SEGMENTS.map((label, i) => {
          const on = i === seg;
          return (
            <TouchableOpacity
              key={label}
              style={[styles.seg, on && styles.segOn]}
              onPress={() => setSeg(i)}
              activeOpacity={0.9}
            >
              <Text style={[styles.segTxt, on && styles.segTxtOn]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 리스트 (간격을 줄여 밀착) */}
      <FlatList
        data={data}
        keyExtractor={(it) => String(it.id)}
        renderItem={({ item }) => (
          <View style={{ marginHorizontal: 16, marginBottom: 8 }}>
            <ChatListItem
              item={item}
              onPress={() => navigation.navigate('ChatRoom', { id: item.id })}
            />
          </View>
        )}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 12 }}
        showsVerticalScrollIndicator={false}
      />

      {/* 방 생성 모달 */}
      <Modal transparent visible={showCreate} animationType="fade" onRequestClose={() => setShowCreate(false)}>
        <View style={styles.modalDim}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>새 채팅방 생성</Text>
            <TextInput
              placeholder="방 제목"
              value={roomTitle}
              onChangeText={setRoomTitle}
              style={styles.input}
              placeholderTextColor={colors.textTertiary}
            />
            <View style={styles.typeRow}>
              {['일반채팅', '즉석만남', '이성친구'].map((t) => {
                const on = roomType === t;
                return (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typePill, on && styles.typePillOn]}
                    onPress={() => setRoomType(t)}
                  >
                    <Text style={[styles.typePillTxt, on && styles.typePillTxtOn]}>{t}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.modalBtns}>
              <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => setShowCreate(false)}>
                <Text style={[styles.btnTxt, { color: colors.primary }]}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnPrimary]}
                onPress={() => {
                  // TODO: 실제 방 생성 API 연동
                  setShowCreate(false);
                  setRoomTitle('');
                  setRoomType('일반채팅');
                }}
              >
                <Text style={[styles.btnTxt, { color: '#fff' }]}>생성</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: colors.text },

  segWrap: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 14 },
  seg: {
    paddingVertical: 10, paddingHorizontal: 16, borderRadius: 18,
    backgroundColor: colors.pillBg, borderWidth: 1, borderColor: colors.border,
  },
  segOn: { backgroundColor: colors.pillActiveBg, borderColor: colors.pillActiveBorder },
  segTxt: { color: colors.textSecondary, fontWeight: '700' },
  segTxtOn: { color: colors.primary },

  modalDim: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { width: '86%', backgroundColor: '#fff', borderRadius: 16, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 10 },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
    color: colors.text,
  },
  typeRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  typePill: {
    paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16,
    backgroundColor: colors.pillBg, borderWidth: 1, borderColor: colors.border,
  },
  typePillOn: { backgroundColor: colors.pillActiveBg, borderColor: colors.pillActiveBorder },
  typePillTxt: { color: colors.textSecondary, fontWeight: '700' },
  typePillTxtOn: { color: colors.primary },

  modalBtns: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 16 },
  btn: { height: 44, borderRadius: 12, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  btnPrimary: { backgroundColor: colors.primary },
  btnOutline: { backgroundColor: '#fff', borderWidth: 2, borderColor: colors.primary },
  btnTxt: { fontWeight: '800' },
});
