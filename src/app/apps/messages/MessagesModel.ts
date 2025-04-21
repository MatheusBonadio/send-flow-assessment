import {
  collection,
  query,
  orderBy,
  serverTimestamp,
  addDoc,
  doc,
  PartialWithFieldValue,
  getDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import { firestore } from '@/app/core/lib/firebase';
import { collectionData } from '@/app/core/lib/rxjs';
import { useRxValue } from '@/app/core/hooks/useRxValue';
import { from, map, switchMap } from 'rxjs';
import { getContactById } from '../contacts/ContactsModel';

export enum StatusMessage {
  Scheduled = 'scheduled',
  Sent = 'sent',
}

export interface Message {
  id: string;
  contactID: string;
  contactName?: string;
  body: string;
  broadcastID: string;
  broadcastName?: string;
  status: StatusMessage;
  userId: string;
  scheduledAt: Timestamp;
  createdAt: Timestamp;
}

export const messagesCollection = collection(firestore, 'messages');

export function getMessages$(userId: string, status: StatusMessage) {
  return collectionData<Message>(
    query(
      messagesCollection,
      where('userId', '==', userId),
      where('status', '==', status),
      orderBy('scheduledAt', 'asc'),
    ),
  ).pipe(
    switchMap((messages) => {
      const enriched$ = messages.map(async (message) => {
        const contactSnap = await getContactById(message.contactID);
        const contactData = contactSnap.exists() ? contactSnap.data() : null;

        return {
          ...message,
          contactName: contactData?.name,
        };
      });

      return from(Promise.all(enriched$));
    }),
  );
}

export function useMessages(userId: string, status: StatusMessage) {
  return useRxValue(getMessages$(userId, status));
}

export function useMessagesCount(userId: string, status: StatusMessage) {
  return useRxValue(
    getMessages$(userId, status).pipe(map((msgs) => msgs.length)),
  );
}

export function getMessageById(id: string) {
  return getDoc(doc(messagesCollection, id));
}

export function createMessage(
  userId: string,
  data: PartialWithFieldValue<Message>,
) {
  return addDoc(messagesCollection, {
    ...data,
    userId,
    createdAt: serverTimestamp(),
    status: StatusMessage.Scheduled,
  });
}
