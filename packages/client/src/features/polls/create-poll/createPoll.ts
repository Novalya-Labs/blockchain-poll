import { useAuthStore } from '@/features/auth/authStore';
import z from 'zod';

export const createPollSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  options: z.array(z.string()).min(2),
});

export type CreatePollPayload = z.infer<typeof createPollSchema>;

export const createPoll = async (payload: CreatePollPayload) => {
  const { role } = useAuthStore.getState();

  if (role !== 'admin') {
    throw new Error('You are not authorized to create a poll');
  }

  const response = await fetch('/api/polls', {
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
