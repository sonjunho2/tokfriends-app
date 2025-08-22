import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { listTopics, listPostsByTopic } from '../api/topics';

export default function TestTopicsScreen() {
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState([]);
  const [topicId, setTopicId] = useState('');
  const [posts, setPosts] = useState([]);

  const onLoadTopics = async () => {
    try {
      setLoading(true);
      const t = await listTopics();
      setTopics(t);
    } catch (e) {
      setTopics([{ error: e?.status, detail: e?.data || e?.message }]);
    } finally {
      setLoading(false);
    }
  };

  const onLoadPosts = async () => {
    if (!topicId) return;
    try {
      setLoading(true);
      const p = await listPostsByTopic(topicId.trim());
      setPosts(p);
    } catch (e) {
      setPosts([{ error: e?.status, detail: e?.data || e?.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={s.wrap}>
      <Text style={s.title}>토픽 / 게시글 테스트</Text>

      <Pressable style={[s.btn, { backgroundColor: '#111827' }]} onPress={onLoadTopics} disabled={loading}>
        <Text style={s.btnText}>토픽 불러오기 (GET /topics)</Text>
      </Pressable>

      {loading && <ActivityIndicator style={{ marginTop: 12 }} />}

      <Text style={[s.label, { marginTop: 12 }]}>토픽 결과</Text>
      <View style={s.box}>
        <Text style={s.mono}>{safe(JSON.stringify(topics, null, 2))}</Text>
      </View>

      <Text style={[s.label, { marginTop: 12 }]}>토픽 ID 입력 후 게시글 보기</Text>
      <TextInput style={s.input} placeholder="예: 1 또는 uuid" value={topicId} onChangeText={setTopicId} />
      <Pressable style={[s.btn, { backgroundColor: '#2563eb' }]} onPress={onLoadPosts} disabled={loading || !topicId}>
        <Text style={s.btnText}>게시글 불러오기 (GET /topics/:id/posts)</Text>
      </Pressable>

      <Text style={[s.label, { marginTop: 12 }]}>게시글 결과</Text>
      <View style={s.box}>
        <Text style={s.mono}>{safe(JSON.stringify(posts, null, 2))}</Text>
      </View>
    </ScrollView>
  );
}

function safe(t) { try { return t; } catch { return String(t); } }

const s = StyleSheet.create({
  wrap: { padding: 20, paddingTop: 60 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  label: { fontSize: 13, color: '#4b5563', marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: 'white' },
  btn: { alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 10, marginTop: 10 },
  btnText: { color: 'white', fontWeight: '700' },
  box: { marginTop: 6, backgroundColor: '#f3f4f6', borderRadius: 8, padding: 10 },
  mono: { fontFamily: 'monospace' },
});
