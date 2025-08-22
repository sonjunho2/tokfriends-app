// src/api/community.js
import { http } from '../lib/http';

// 신고 생성 (백엔드에서 targetUserId를 reportedId로 매핑 처리)
export async function reportUser({ reporterId, targetUserId, reason, postId = null }) {
  return await http.post('/community/report', { reporterId, targetUserId, reason, postId });
}

// 차단
export async function blockUser({ blockerId, targetUserId }) {
  return await http.post('/community/block', { blockerId, targetUserId });
}
