// tokfriends-app/src/api/posts.js
import client from './client';

export const postsApi = {
  async listPosts(params = {}) {
    const response = await client.get('/posts', {
      params: {
        cursor: params.cursor,
        take: params.take || 20,
        topicId: params.topicId,
      },
    });
    return response.data;
  },

  async createPost({ title, content, topicId }) {
    const response = await client.post('/posts', {
      title,
      content,
      topicId,
    });
    return response.data;
  },

  async getPost(id) {
    const response = await client.get(`/posts/${id}`);
    return response.data;
  },

  async updatePost(id, data) {
    const response = await client.patch(`/posts/${id}`, data);
    return response.data;
  },

  async deletePost(id) {
    const response = await client.delete(`/posts/${id}`);
    return response.data;
  },

  async likePost(id) {
    const response = await client.post(`/posts/${id}/like`);
    return response.data;
  },

  async unlikePost(id) {
    const response = await client.delete(`/posts/${id}/like`);
    return response.data;
  },
};

export default postsApi;