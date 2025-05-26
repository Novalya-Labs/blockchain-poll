import { env } from '@/src/configs/env';
import i18next from 'i18next';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, AuthStore } from './authType';
import { signIn as signInService } from './sign-in/signIn';

const initialAuthState: AuthState = {
  isAuthenticated: false,
  role: null,
  voterId: null,
  loading: false,
  error: null,
  language: 'en',
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialAuthState,

      signIn: async (payload) => {
        set({ loading: true, error: null });
        try {
          const { success, role, voterId } = await signInService(payload);
          if (!success) {
            throw new Error('Invalid email or password');
          }
          set({ isAuthenticated: true, loading: false, role, voterId });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to sign in',
          });
          throw error;
        }
      },

      signOut: async () => {
        set({ loading: true, error: null });
        try {
          set({ ...initialAuthState });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to sign out',
          });
        }
      },

      resetAuth: () => {
        set({ ...initialAuthState });
      },

      clearError: () => {
        set({ error: null });
      },

      setLanguage: (language) => {
        i18next.changeLanguage(language);
        set({ language });
      },
    }),
    {
      name: `auth-storage-${env.app.appKey}`,
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        language: state.language,
        role: state.role,
        voterId: state.voterId,
      }),
    },
  ),
);
