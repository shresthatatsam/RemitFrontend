import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7001/api',
  headers: { 'Content-Type': 'application/json' },
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('remitly_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export const useMockApi = import.meta.env.VITE_USE_MOCK_API !== 'false';
