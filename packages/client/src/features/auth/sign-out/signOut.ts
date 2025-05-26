import { useAuthStore } from '../authStore';

export const signOut = async () => {
  try {
    useAuthStore.getState().resetAuth();

    return true;
  } catch (error) {
    throw new Error(error as string);
  }
};
