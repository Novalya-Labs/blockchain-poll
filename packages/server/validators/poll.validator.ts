import { z } from 'zod';

export const createPollSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  options: z.array(z.string()).min(2),
});

export const getPollSchema = z.object({
  pollId: z.string().uuid(),
});
