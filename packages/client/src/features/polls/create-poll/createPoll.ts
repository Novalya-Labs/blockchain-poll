import z from 'zod';

export const createPollSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export type CreatePollPayload = z.infer<typeof createPollSchema>;

export const createPoll = async (payload: CreatePollPayload) => {
  const response = await fetch('/api/polls', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response.json();
};
