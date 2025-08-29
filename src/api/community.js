import { apiClient } from './client';

export async function reportUser({ reporterId, targetUserId, reason, postId = null }) {
  return await apiClient.reportUser({ reporterId, targetUserId, reason, postId });
}

export async function blockUser({ blockerId, targetUserId }) {
  return await apiClient.blockUser({ blockerId, targetUserId });
}
