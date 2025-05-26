import { z } from 'zod';

export const castVoteSchema = z.object({
  voterId: z.string().min(3),
  choice: z.string().min(1),
});

export const getMyVoteStatusSchema = z.object({
  voterId: z.string().min(3),
  pollId: z.string().uuid(),
});
