import { env } from '@/src/configs/env';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { VoteState, VoteStore, Vote } from './votesType';
import { getVotes } from './get-votes/getVotes';
import { createVote } from './create-vote/createPoll';

const initialVoteState: VoteState = {
  votes: [],
  loading: false,
  error: null,
};

export const useVoteStore = create<VoteStore>()(
  persist(
    (set) => ({
      ...initialVoteState,

      createVote: async (payload) => {
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

      getVotes: async () => {
        set({ loading: true, error: null });
        try {
          const votes = await getVotes();
          set({ votes: votes as Vote[], loading: false });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to get votes',
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
