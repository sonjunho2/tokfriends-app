// src/screens/main/ChatsScreen.js
import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';
import ChatListItem from '../../components/ChatListItem';

const SEGMENTS = ['전체','읽지 않음','신규','즐겨찾기'];

export default function ChatsScreen({ navigation }) {
  const [seg, setSeg] = useState(0);
  const [data, setData] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: ['여행','수별','같이','포에','시얏'][i%5],
      age: [26,31,22,40,35][i%5],
      points: [0,3,0,8,1][i%5],
      preview: ['주말에 시간 괜찮으세요?','사진 고마워요 :)','네! 확인했습니다','헬스 같이 하실래요?','안녕하세요!'][i%5],
      timeLabel: ['4분','1시간','17시간','2일','6시간'][i%5],
      regionLabel: ['서울','대전','대전','울산','서울'][i%5],
      distanceKm: [7,132,270,22,233][i%5],
      unread: [2,0,1,0,3][i%5],
      online: [true,false,true,false,false][i%5],
      pinned: i % 7 === 0,
    }))
  );

  // 새 채팅방 만들기 모달
  const [open, setOpen] = useState(false);
  const [roomTitle, setRoomTitle] = useState('');
  const [roomType, setRoomType] = useState('일반채팅'); // 일반채팅 | 즉석만남 | 이성친구

  const filtered = useMemo(() => {
    let list = data.slice();
    if (seg === 1) list = list.filter(x => x.unread > 0);
    if (seg === 2) list = list.slice(0, 5); // 데모: 신규
    if (seg === 3) list = list.filter(x => x.pinned);
    return list;
  }, [data, seg]);

  const onCreateRoom = () => {
    const title = roomTitle.trim();
    if (!title) {
      Alert.alert('안내', '방 제목을 입력해 주세요.');
      return;
    }
    // 서버 연동 시 이 부분만 API로 교체
    const nowId = Math.max(0, ...data.map(d=>d.id)) + 1;
    setData(prev => [
      {
        id: nowId,
        name: title,
        age: 0,
        points: 0,
        preview: `${roomType} 방이 생성되었어요.`,
        timeLabel: '방금',
        regionLabel: '서울',
        distanceKm: 0,
        unread: 0,
        online: false,
        pinned: false,
      },
      ...prev,
    ]);
    setOpen(false);
    setRoomTitle('');
    setRoomType('일반채팅');
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>대화</Text>
        <TouchableOpacity onPress={() => setOpen(true)} hitSlop={8} style={{ paddingHorizontal: 6 }}>
          <Ionicons name="add-circle" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* 알약 세그먼트 */}
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

      {/* 리스트 */}
      <FlatList
        data={filtered}
        keyExtractor={(it) => String(it.id)}
        renderItem={({ item }) => (
          <ChatListItem
            item={item}
            onPress={() => navigation.navigate('ChatRoom', { id: item.id })}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12, gap: 10 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        showsVerticalScrollIndicator={false}
      />

      {/* 방 생성 모달 */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={()=>setOpen(false)}>
        <View style={styles.dim}>
          <View style={styles.modalWrap}>
            <Text style={styles.modalTitle}>새 채팅방 만들기</Text>
            <TextInput
              placeholder="방 제목"
              placeholderTextColor={colors.textTertiary}
              value={roomTitle}
              onChangeText={setRoomTitle}
              style={styles.input}
            />
            <View style={styles.typeRow}>
              {['일반채팅','즉석만남','이성친구'].map(t => {
                const on = roomType === t;
                return (
                  <TouchableOpacity key={t} onPress={()=>setRoomType(t)} style={[styles.typePill, on && styles.typeOn]}>
                    <Text style={[styles.typeTxt, on && styles.typeTxtOn]}>{t}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.modalBtns}>
              <TouchableOpacity style={[styles.mbtn, styles.cancel]} onPress={()=>setOpen(false)}>
                <Text style={styles.mbtnTxt}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.mbtn, styles.create]} onPress={onCreateRoom}>
                <Text style={[styles.mbtnTxt, { color:'#fff' }]}>만들기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor: colors.background },
  header:{
    flexDirection:'row', alignItems:'center', justifyContent:'space-between',
    paddingHorizontal:12, paddingVertical:10,
    backgroundColor: colors.backgroundSecondary, borderBottomWidth:1, borderBottomColor: colors.border
  },
  headerTitle:{ fontSize:22, fontWeight:'800', color: colors.text },

  segWrap:{ flexDirection:'row', gap:10, paddingHorizontal:16, paddingVertical:14 },
  seg:{ paddingVertical:10, paddingHorizontal:16, borderRadius:18, backgroundColor: colors.pillBg, borderWidth:1, borderColor: colors.border },
  segOn:{ backgroundColor: colors.pillActiveBg, borderColor: colors.pillActiveBorder },
  segTxt:{ color: colors.textSecondary, fontWeight:'700' },
  segTxtOn:{ color: colors.primary },

  dim:{ flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'center', alignItems:'center' },
  modalWrap:{ width:'86%', backgroundColor:'#fff', borderRadius:16, padding:16, borderWidth:1, borderColor: colors.border },
  modalTitle:{ fontSize:18, fontWeight:'800', color: colors.text, marginBottom:10 },
  input:{
    borderWidth:1, borderColor: colors.border, borderRadius:12,
    paddingHorizontal:12, paddingVertical:12, color: colors.text
  },
  typeRow:{ flexDirection:'row', gap:8, marginTop:10, marginBottom:16, flexWrap:'wrap' },
  typePill:{ paddingVertical:8, paddingHorizontal:12, borderRadius:18, backgroundColor: colors.pillBg, borderWidth:1, borderColor: colors.border },
  typeOn:{ backgroundColor: colors.pillActiveBg, borderColor: colors.pillActiveBorder },
  typeTxt:{ color: colors.textSecondary, fontWeight:'700' },
  typeTxtOn:{ color: colors.primary },

  modalBtns:{ flexDirection:'row', justifyContent:'flex-end', gap:10, marginTop:6 },
  mbtn:{ paddingVertical:12, paddingHorizontal:16, borderRadius:12, borderWidth:1 },
  cancel:{ borderColor: colors.border, backgroundColor:'#fff' },
  create:{ borderColor: colors.primary, backgroundColor: colors.primary },
  mbtnTxt:{ color: colors.text, fontWeight:'800' },
});
