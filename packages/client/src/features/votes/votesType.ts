import { CreateVotePayload } from './create-vote/createPoll';

export interface Vote {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface VoteState {
  votes: Vote[];
  loading: boolean;
  error: string | null;
}

export type VoteStore = VoteState & {
  createVote: (payload: CreateVotePayload) => Promise<void>;
  getVotes: () => Promise<void>;
  resetVotes: () => void;
};
