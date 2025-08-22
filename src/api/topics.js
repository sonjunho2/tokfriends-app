// src/api/topics.js
import { http } from '../lib/http';

// 토픽 목록
export async function listTopics() {
  const { data } = await http.get('/topics'); // 백엔드가 { data: [...] } 형태면 그대로, 아니면 수정
  // 만약 백엔드가 배열을 바로 리턴한다면: return await http.get('/topics');
  return Array.isArray(data) ? data : (data || []);
}

// 특정 토픽의 게시글
export async function listPostsByTopic(topicId) {
  if (!topicId) throw new Error('topicId is required');
  const { data } = await http.get(`/topics/${topicId}/posts`);
  return Array.isArray(data) ? data : (data || []);
}

// (옵션) 게시글 생성 — 백엔드가 body 스펙을 받을 때만 사용
export async function createPost(payload) {
  // 예: { topicId, authorId, content }
  return await http.post('/posts', payload);
}
