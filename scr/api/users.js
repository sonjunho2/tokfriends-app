// tokfriends-app/src/api/users.js
import client from './client';

export const usersApi = {
  async getUserById(id) {
    const response = await client.get(`/users/${id}`);
    return response.data;
  },

  async updateProfile(id, data) {
    const response = await client.patch(`/users/${id}`, data);
    return response.data;
  },

  async searchUsers(query) {
    const response = await client.get('/users/search', {
      params: { q: query },
    });
    return response.data;
  },
};

export default usersApi;