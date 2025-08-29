import { apiClient } from './client';

export const usersApi = {
  async getUserById(id) {
    return await apiClient.getUser(id);
  },

  async getMe() {
    return await apiClient.getMe();
  },

  async updateProfile(id, data) {
    const response = await apiClient.patch(`/users/${id}`, data);
    return response.data;
  },

  async searchUsers(query) {
    const response = await apiClient.get('/users/search', {
      params: { q: query },
    });
    return response.data;
  },
};

export default usersApi;
