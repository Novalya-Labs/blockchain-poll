import { CreatePollPayload } from './create-poll/createPoll';
import { GetPollPayload } from './get-poll/getPoll';

export interface Poll {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface PollState {
  polls: Poll[];
  poll: Poll | null;
  loading: boolean;
  error: string | null;
}

export type PollStore = PollState & {
  createPoll: (payload: CreatePollPayload) => Promise<void>;
  getPolls: () => Promise<void>;
  getPoll: (payload: GetPollPayload) => Promise<void>;
  resetPolls: () => void;
  clearError: () => void;
};
