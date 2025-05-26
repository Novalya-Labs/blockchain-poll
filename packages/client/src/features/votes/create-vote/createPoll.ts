import z from 'zod';

export const createVoteSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  options: z.array(z.string()).min(2),
});

export type CreateVotePayload = z.infer<typeof createVoteSchema>;

export const createVote = async (payload: CreateVotePayload) => {
  const response = await fetch('/api/votes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response.json();
};
