import z from 'zod';

export const createPollSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  options: z.array(z.string()).min(2),
});

export type CreatePollPayload = z.infer<typeof createPollSchema>;

export const createPoll = async (payload: CreatePollPayload) => {
  const response = await fetch('/api/polls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return response.json();
};
