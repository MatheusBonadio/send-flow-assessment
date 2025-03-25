import { z } from 'zod';

export const contactSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  phone: z.string().min(10).max(15), // Ajuste conforme necessário
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Contact = z.infer<typeof contactSchema>;

export const createContactSchema = contactSchema.pick({ name: true, phone: true });

export type CreateContact = z.infer<typeof createContactSchema>;
