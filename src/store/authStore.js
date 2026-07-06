import { create } from 'zustand';
import api from '../utils/axios';

const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),

  login: async (username, password) => {
    const { data } = await api.post('/api/auth/login/', { username, password });
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    set({ user: data.user });
    return data.user;
  },

  register: async (formData) => {
    const { data } = await api.post('/api/auth/register/', formData);
    return data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null });
  },

  fetchMe: async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) { set({ loading: false }); return; }
      const { data } = await api.get('/api/auth/me/');
      set({ user: data, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
}));

export default useAuthStore;
