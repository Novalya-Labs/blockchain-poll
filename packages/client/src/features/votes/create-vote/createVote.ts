import z from 'zod';

export const createVoteSchema = z.object({
  pollId: z.string().uuid(),
  option: z.string().min(1),
});

export type CreateVotePayload = z.infer<typeof createVoteSchema>;

export const createVote = async (payload: CreateVotePayload) => {
  const response = await fetch('/api/votes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response.json();
};
