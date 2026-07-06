import { useEffect } from 'react';
import useAuthStore from '../store/authStore';

export default function useAuth() {
  const { user, loading, login, logout, register, fetchMe } = useAuthStore();

  useEffect(() => {
    if (loading) fetchMe();
  }, []);

  return { user, loading, login, logout, register };
}
