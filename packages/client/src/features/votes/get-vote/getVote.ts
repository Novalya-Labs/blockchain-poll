import { useAuthStore } from '@/features/auth/authStore';
import z from 'zod';

export const getVoteSchema = z.object({
  pollId: z.string().uuid(),
});

export type GetVotePayload = z.infer<typeof getVoteSchema>;

export interface VoteStatusResponse {
  hasVoted: boolean;
}

export const getVote = async (payload: GetVotePayload): Promise<VoteStatusResponse> => {
  const { voterId, role } = useAuthStore.getState();

  if (role !== 'civil') {
    throw new Error('You are not authorized to get a vote');
  }

  if (!voterId) {
    throw new Error('Voter ID is required');
  }

  const response = await fetch(`/api/votes/${payload.pollId}/vote?voterId=${voterId}&role=${role}`);
  return response.json();
};
