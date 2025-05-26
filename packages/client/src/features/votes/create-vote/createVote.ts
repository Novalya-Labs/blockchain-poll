import z from 'zod';

export const createVoteSchema = z.object({
  voterId: z.string().min(3),
  choice: z.string().min(1),
});

export type CreateVotePayload = z.infer<typeof createVoteSchema>;

export const createVote = async (pollId: string, payload: CreateVotePayload) => {
  const response = await fetch(`/api/polls/${pollId}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return response.json();
};
