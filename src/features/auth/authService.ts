import { api, useMockApi } from '../../lib/http';
import type { User } from '../../types';

const DEMO_USER: User = { id: 'demo-user', email: 'alex@example.com', fullName: 'Alex Morgan', role: 'User', emailConfirmed: true };
export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    if (useMockApi) {
      if (!email.includes('@') || password.length < 6) throw new Error('Enter a valid email and a password with at least 6 characters.');
      const user = { ...DEMO_USER, email, fullName: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), role: email.toLowerCase().startsWith('admin') ? 'Admin' as const : 'User' as const };
      return { user, token: 'demo-token' };
    }
    const { data } = await api.post('/auth/login', { email, password });
    return { user: data.user ?? { id: data.userId, email, role: data.role ?? 'User' }, token: data.token ?? data.accessToken };
  },
  async register(fullName: string, email: string, password: string): Promise<void> {
    if (useMockApi) {
      if (!fullName.trim() || !email.includes('@') || password.length < 8) throw new Error('Please complete all fields. Use a password with at least 8 characters.');
      await new Promise(resolve => setTimeout(resolve, 450));
      return;
    }
    await api.post('/auth/register', { fullName, email, password });
  },
};
