import { useAuthStore } from '@/features/auth/authStore';

export const getVotes = async (pollId: string) => {
  const { role } = useAuthStore.getState();

  if (role !== 'admin') {
    throw new Error('You are not authorized to fetch votes');
  }

  const response = await fetch(`/api/polls/${pollId}/votes?role=${role}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch votes');
  }

  return response.json();
};
