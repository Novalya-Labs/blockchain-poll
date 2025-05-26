import z from 'zod';

export const getPollSchema = z.object({
  id: z.string().uuid(),
});

export type GetPollPayload = z.infer<typeof getPollSchema>;

export const getPoll = async (payload: GetPollPayload) => {
  const response = await fetch(`/api/polls/${payload.id}`);
  return response.json();
};
