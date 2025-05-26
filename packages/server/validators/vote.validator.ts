import { z } from 'zod';

export const castVoteSchema = z.object({
  role: z.enum(['civil', 'admin']),
  voterId: z.string().min(3),
  choice: z.string().min(1),
});

export const getMyVoteStatusSchema = z.object({
  role: z.enum(['civil', 'admin']),
  voterId: z.string().min(3),
});

export const getMyVoteStatusParamsSchema = z.object({
  pollId: z.string().uuid(),
});
