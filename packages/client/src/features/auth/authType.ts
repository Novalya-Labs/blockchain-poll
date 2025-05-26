import type { SignInPayload } from './sign-in/signIn';

export type Role = 'civil' | 'admin';

export interface AuthState {
  isAuthenticated: boolean;
  role: Role | null;
  voterId: string | null;
  loading: boolean;
  error: string | null;
  language: string;
}

export type AuthStore = AuthState & {
  signIn: (payload: SignInPayload) => Promise<void>;
  signOut: () => Promise<void>;
  resetAuth: () => void;
  clearError: () => void;
  setLanguage: (language: string) => void;
};
