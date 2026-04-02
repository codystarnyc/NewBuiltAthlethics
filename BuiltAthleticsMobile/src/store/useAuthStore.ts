import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authApi from '../api/auth';
import type { AuthResponse, LoginRequest, SignUpRequest, User } from '../api/types';
import { clearAuthStorage, setAuthToken } from '../utils/storage';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;

  login: (data: LoginRequest) => Promise<void>;
  signUp: (data: SignUpRequest) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  setOnboardingComplete: () => void;
  restoreSession: (data: AuthResponse) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      hasCompletedOnboarding: false,

      login: async (data) => {
        set({ isLoading: true });
        try {
          const res = await authApi.login(data);
          await setAuthToken(res.authToken);
          set({
            user: { id: res.id, email: res.email, name: res.name },
            token: res.authToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({ isLoading: false });
          throw new Error('Login failed');
        }
      },

      signUp: async (data) => {
        set({ isLoading: true });
        try {
          const res = await authApi.signUp(data);
          await setAuthToken(res.authToken);
          set({
            user: { id: res.id, email: res.email, name: res.name },
            token: res.authToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({ isLoading: false });
          throw new Error('Sign up failed');
        }
      },

      logout: async () => {
        await clearAuthStorage();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          hasCompletedOnboarding: false,
        });
      },

      setUser: (user) => set({ user }),

      setOnboardingComplete: () => set({ hasCompletedOnboarding: true }),

      restoreSession: (data) =>
        set({
          user: { id: data.id, email: data.email, name: data.name },
          token: data.authToken,
          isAuthenticated: true,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    },
  ),
);
