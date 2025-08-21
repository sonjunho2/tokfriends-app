// tokfriends-app/src/api/auth.js
import client from './client';

export const authApi = {
  async signup({ email, password, displayName, gender, dob }) {
    const response = await client.post('/auth/signup/email', {
      email,
      password,
      displayName,
      gender,
      dob,
    });
    return response.data;
  },

  async login(email, password) {
    const response = await client.post('/auth/login/email', {
      email,
      password,
    });
    return response.data;
  },

  async me() {
    const response = await client.get('/users/me');
    return response.data;
  },
};

export default authApi;