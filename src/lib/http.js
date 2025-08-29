// Deprecated: Use src/api/client.js instead
// This file is kept for backward compatibility
import client, { setAuthToken as setToken, clearToken } from '../api/client';
import { API_BASE_URL } from '../config/env';

export const setAuthToken = setToken;
export const clearAuthToken = clearToken;

export const http = {
  get: (path, headers) => client.get(path, { headers }),
  post: (path, body, headers) => client.post(path, body, { headers }),
  put: (path, body, headers) => client.put(path, body, { headers }),
  del: (path, headers) => client.delete(path, { headers }),
};

export default client;
