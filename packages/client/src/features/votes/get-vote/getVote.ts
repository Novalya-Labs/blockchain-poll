import z from 'zod';

export const getVoteSchema = z.object({
  pollId: z.string().uuid(),
});

export type GetVotePayload = z.infer<typeof getVoteSchema>;

export const getVote = async (payload: GetVotePayload) => {
  const response = await fetch(`/api/polls/${payload.pollId}/vote`);
  return response.json();
};
