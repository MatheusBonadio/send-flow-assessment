import { z } from 'zod';

export const messageSchema = z.object({
  id: z.string(),
  body: z.string().min(1),
  contactID: z.string(),
  contactName: z.string(),
  broadcastID: z.string(),
  broadcastName: z.string(),
  status: z.enum(['scheduled', 'sent']),
  scheduledAt: z.date(),
});

export type Message = z.infer<typeof messageSchema>;
