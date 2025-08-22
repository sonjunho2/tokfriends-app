import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert, StyleSheet, ScrollView } from 'react-native';
import { reportUser, blockUser } from '../api/community';

export default function TestCommunityScreen() {
  const [reporterId, setReporterId] = useState('');
  const [blockerId, setBlockerId] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  const [postId, setPostId] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState(null);

  const onReport = async () => {
    if (!reporterId || !targetUserId || !reason) {
      Alert.alert('입력 필요', '신고자/대상/사유를 입력해 주세요.');
      return;
    }
    try {
      setLoading(true);
      const res = await reportUser({ reporterId: reporterId.trim(), targetUserId: targetUserId.trim(), reason: reason.trim(), postId: postId ? postId.trim() : null });
      setLast(res);
      Alert.alert('신고 요청 완료', '서버 응답을 확인하세요.');
    } catch (e) {
      setLast(e?.data || e?.message);
      Alert.alert('신고 실패', errMsg(e));
    } finally {
      setLoading(false);
    }
  };

  const onBlock = async () => {
    if (!blockerId || !targetUserId) {
      Alert.alert('입력 필요', '차단자/대상을 입력해 주세요.');
      return;
    }
    try {
      setLoading(true);
      const res = await blockUser({ blockerId: blockerId.trim(), targetUserId: targetUserId.trim() });
      setLast(res);
      Alert.alert('차단 요청 완료', '서버 응답을 확인하세요.');
    } catch (e) {
      setLast(e?.data || e?.message);
      Alert.alert('차단 실패', errMsg(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={s.wrap}>
      <Text style={s.title}>신고 / 차단 테스트</Text>

      <Text style={s.label}>신고자 ID (reporterId)</Text>
      <TextInput style={s.input} value={reporterId} onChangeText={setReporterId} placeholder="예: 사용자 ID" />

      <Text style={s.label}>차단자 ID (blockerId)</Text>
      <TextInput style={s.input} value={blockerId} onChangeText={setBlockerId} placeholder="예: 사용자 ID" />

      <Text style={s.label}>대상 유저 ID (targetUserId)</Text>
      <TextInput style={s.input} value={targetUserId} onChangeText={setTargetUserId} placeholder="예: 사용자 ID" />

      <Text style={s.label}>게시글 ID (선택, postId)</Text>
      <TextInput style={s.input} value={postId} onChangeText={setPostId} placeholder="선택 입력" />

      <Text style={s.label}>신고 사유 (reason)</Text>
      <TextInput style={s.input} value={reason} onChangeText={setReason} placeholder="사유 입력" />

      <View style={s.row}>
        <Pressable style={[s.btn, { backgroundColor: '#111827' }]} onPress={onReport} disabled={loading}>
          <Text style={s.btnText}>신고 (POST /community/report)</Text>
        </Pressable>
        <Pressable style={[s.btn, { backgroundColor: '#dc2626' }]} onPress={onBlock} disabled={loading}>
          <Text style={s.btnText}>차단 (POST /community/block)</Text>
        </Pressable>
      </View>

      {loading && <ActivityIndicator style={{ marginTop: 12 }} />}

      <Text style={[s.label, { marginTop: 12 }]}>최근 응답</Text>
      <View style={s.box}>
        <Text style={s.mono}>{safe(JSON.stringify(last, null, 2))}</Text>
      </View>
    </ScrollView>
  );
}

function errMsg(e) {
  if (e?.data?.message) return Array.isArray(e.data.message) ? e.data.message.join('\n') : String(e.data.message);
  if (typeof e?.message === 'string') return e.message;
  return '요청 실패';
}
function safe(t) { try { return t; } catch { return String(t); } }

const s = StyleSheet.create({
  wrap: { padding: 20, paddingTop: 60 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  label: { fontSize: 13, color: '#4b5563', marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: 'white' },
  row: { flexDirection: 'row', gap: 12, marginTop: 16 },
  btn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 10 },
  btnText: { color: 'white', fontWeight: '700', textAlign: 'center' },
  box: { marginTop: 6, backgroundColor: '#f3f4f6', borderRadius: 8, padding: 10 },
  mono: { fontFamily: 'monospace' },
});
