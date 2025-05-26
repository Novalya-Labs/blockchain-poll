import { useAuthStore } from '@/features/auth/authStore';
import z from 'zod';

export const createVoteSchema = z.object({
  voterId: z.string().min(3),
  choice: z.string().min(1),
});

export type CreateVotePayload = z.infer<typeof createVoteSchema>;

export const createVote = async (pollId: string, payload: CreateVotePayload) => {
  const { role } = useAuthStore.getState();

  if (role !== 'civil') {
    throw new Error('You are not authorized to create a vote');
  }

  const response = await fetch(`/api/votes/${pollId}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...payload,
      role,
    }),
  });
  return response.json();
};
