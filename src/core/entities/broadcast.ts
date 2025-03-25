import { z } from 'zod';

export const broadcastSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  scheduledAt: z.date(),
  messageBody: z.string().min(1),
  connectionID: z.string(),
  connectionName: z.string(),
  contactsIDs: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Broadcast = z.infer<typeof broadcastSchema>;
