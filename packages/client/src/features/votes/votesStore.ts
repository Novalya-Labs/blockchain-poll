import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createVote, CreateVotePayload } from './create-vote/createVote';
import { getVotes } from './get-votes/getVotes';
import { getVote, GetVotePayload } from './get-vote/getVote';
import type { VoteStore, Vote } from './votesType';
import { env } from '@/configs/env';

const initialVoteState = {
  votes: [],
  vote: null,
  loading: false,
  error: null,
};

export const useVoteStore = create<VoteStore>()(
  persist(
    (set) => ({
      ...initialVoteState,

      createVote: async (payload: CreateVotePayload) => {
        set({ loading: true, error: null });
        try {
          await createVote(payload);
          set({ loading: false });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to create vote',
          });
          throw error;
        }
      },

      getVotes: async (pollId: string) => {
        set({ loading: true, error: null });
        try {
          const votes = await getVotes(pollId);
          set({ votes: votes as Vote[], loading: false });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to get votes',
          });
        }
      },

      getVote: async (payload: GetVotePayload) => {
        set({ loading: true, error: null });
        try {
          const vote = await getVote(payload);
          set({ vote: vote as Vote, loading: false });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to get vote',
          });
        }
      },

      resetVotes: () => {
        set({ ...initialVoteState });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: `vote-storage-${env.app.appKey}`,
      partialize: (state) => ({
        loading: state.loading,
        error: state.error,
      }),
    },
  ),
);
