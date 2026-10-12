import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authService } from './authService';
import type { User } from '../../types';

type AuthContextValue = { user: User | null; loading: boolean; login: (email: string, password: string) => Promise<void>; register: (name: string, email: string, password: string) => Promise<void>; logout: () => void };
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { try { const saved = localStorage.getItem('remitly_user'); if (saved) setUser(JSON.parse(saved) as User); } catch { localStorage.removeItem('remitly_user'); } finally { setLoading(false); } }, []);
  const value = useMemo<AuthContextValue>(() => ({
    user, loading,
    async login(email, password) {
      const result = await authService.login(email, password);
      localStorage.setItem('remitly_token', result.token);
      localStorage.setItem('remitly_user', JSON.stringify(result.user));
      setUser(result.user);
    },
    async register(name, email, password) { await authService.register(name, email, password); },
    logout() { localStorage.removeItem('remitly_token'); localStorage.removeItem('remitly_user'); setUser(null); },
  }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used within AuthProvider'); return value; }
