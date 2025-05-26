import { CreateVotePayload } from './create-vote/createVote';
import { GetVotePayload } from './get-vote/getVote';

export interface Vote {
  id: string;
  pollId: string;
  voterId: string;
  choice: string;
  createdAt: string;
}

export interface VoteState {
  votes: Vote[];
  vote: Vote | null;
  loading: boolean;
  error: string | null;
}

export type VoteStore = VoteState & {
  createVote: (pollId: string, payload: CreateVotePayload) => Promise<void>;
  getVotes: (pollId: string) => Promise<void>;
  getVote: (payload: GetVotePayload) => Promise<void>;
  resetVotes: () => void;
  clearError: () => void;
};
