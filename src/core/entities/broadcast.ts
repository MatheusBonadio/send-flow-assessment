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

export const createBroadcastSchema = broadcastSchema.pick({
  name: true,
  scheduledAt: true,
  messageBody: true,
  connectionID: true,
  contactsIDs: true,
});

export type CreateBroadcast = z.infer<typeof createBroadcastSchema>;
