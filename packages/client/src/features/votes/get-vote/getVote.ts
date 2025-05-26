import z from 'zod';

export const getVoteSchema = z.object({
  pollId: z.string().uuid(),
  voterId: z.string().min(3),
});

export type GetVotePayload = z.infer<typeof getVoteSchema>;

export const getVote = async (payload: GetVotePayload) => {
  const response = await fetch(`/api/polls/${payload.pollId}/vote?voterId=${payload.voterId}`);
  return response.json();
};
