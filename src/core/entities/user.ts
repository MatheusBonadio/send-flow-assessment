import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(3).max(50),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;

export const createUserSchema = userSchema.pick({ name: true, email: true });

export type CreateUser = z.infer<typeof createUserSchema>;
