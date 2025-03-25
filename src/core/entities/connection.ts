import { z } from 'zod';

export const connectionSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Connection = z.infer<typeof connectionSchema>;
