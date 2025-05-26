import { z } from 'zod';
import { Role } from '../authType';

export const signInSchema = z.object({
  role: z.enum(['civil', 'admin']),
  email: z.string().email(),
  password: z.string().min(4),
});

export type SignInPayload = z.infer<typeof signInSchema>;

export const signIn = async (payload: SignInPayload): Promise<{ success: boolean; role: Role }> => {
  try {
    return { success: true, role: payload.role };
  } catch (error) {
    throw new Error(error as string);
  }
};
