import { apiClient } from './client';

export const postsApi = {
  async listPosts(params = {}) {
    return await apiClient.getPosts(params);
  },

  async createPost({ title, content, topicId }) {
    return await apiClient.createPost({ title, content, topicId });
  },

  async getPost(id) {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data;
  },

  async updatePost(id, data) {
    const response = await apiClient.patch(`/posts/${id}`, data);
    return response.data;
  },

  async deletePost(id) {
    const response = await apiClient.delete(`/posts/${id}`);
    return response.data;
  },

  async likePost(id) {
    const response = await apiClient.post(`/posts/${id}/like`);
    return response.data;
  },

  async unlikePost(id) {
    const response = await apiClient.delete(`/posts/${id}/like`);
    return response.data;
  },
};

export default postsApi;
