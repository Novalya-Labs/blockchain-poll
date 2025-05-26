import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createPoll, CreatePollPayload } from './create-poll/createPoll';
import { getPolls } from './get-polls/getPolls';
import { getPoll, GetPollPayload } from './get-poll/getPoll';
import type { PollStore, Poll } from './pollsTypes';
import { env } from '@/configs/env';

const initialPollState = {
  polls: [],
  poll: null,
  loading: false,
  error: null,
};

export const usePollStore = create<PollStore>()(
  persist(
    (set) => ({
      ...initialPollState,

      createPoll: async (payload: CreatePollPayload) => {
        set({ loading: true, error: null });
        try {
          await createPoll(payload);
          set({ loading: false });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to create poll',
          });
          throw error;
        }
      },

      getPolls: async () => {
        set({ loading: true, error: null });
        try {
          const polls = await getPolls();
          set({ polls: polls as Poll[], loading: false });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to get polls',
          });
        }
      },

      getPoll: async (payload: GetPollPayload) => {
        set({ loading: true, error: null });
        try {
          const poll = await getPoll(payload);
          set({ poll: poll as Poll, loading: false });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to get poll',
          });
        }
      },

      resetPolls: () => {
        set({ ...initialPollState });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: `poll-storage-${env.app.appKey}`,
      partialize: (state) => ({
        loading: state.loading,
        error: state.error,
      }),
    },
  ),
);
