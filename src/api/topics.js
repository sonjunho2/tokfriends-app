import { apiClient } from './client';

export async function listTopics() {
  return await apiClient.getTopics();
}

export async function listPostsByTopic(topicId) {
  return await apiClient.getTopicPosts(topicId);
}

export async function createPost(payload) {
  return await apiClient.createPost(payload);
}
