// tokfriends-app/src/api/topics.js
import client from './client';

export const topicsApi = {
  async listTopics() {
    const response = await client.get('/topics');
    return response.data;
  },

  async getTopic(id) {
    const response = await client.get(`/topics/${id}`);
    return response.data;
  },

  async getTopicPosts(id, params = {}) {
    const response = await client.get(`/topics/${id}/posts`, {
      params: {
        cursor: params.cursor,
        take: params.take || 20,
      },
    });
    return response.data;
  },
};

export default topicsApi;