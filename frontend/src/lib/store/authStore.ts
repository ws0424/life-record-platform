import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: false,
      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', token);
        }
        set({ user, token, isAuthenticated: true, isInitialized: true });
      },
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
      initialize: () => {
        // 从 localStorage 恢复状态
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('access_token');
          const state = get();
          
          // 如果有 token，认为已登录
          if (token) {
            // 如果 persist 中有用户信息，使用它
            if (state.user) {
              console.log('从 persist 恢复用户信息:', state.user);
              set({ token, user: state.user, isAuthenticated: true, isInitialized: true });
            } else {
              // 没有用户信息，但有 token，仍然认为已登录
              console.log('有 token 但没有用户信息，设置为已登录');
              set({ token, isAuthenticated: true, isInitialized: true });
            }
          } else {
            // 没有 token，清除状态
            console.log('没有 token，清除认证状态');
            set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
          }
        } else {
          set({ isInitialized: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      // 添加 onRehydrateStorage 回调
      onRehydrateStorage: () => (state) => {
        console.log('Zustand persist 恢复完成:', state);
        // 恢复完成后，如果有 token，设置为已认证
        if (state && typeof window !== 'undefined') {
          const token = localStorage.getItem('access_token');
          if (token && state.user) {
            state.isAuthenticated = true;
            state.token = token;
            console.log('恢复认证状态成功');
          }
        }
      },
    }
  )
);

