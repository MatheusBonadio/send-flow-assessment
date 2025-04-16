import {
  collection,
  query,
  orderBy,
  serverTimestamp,
  addDoc,
  CollectionReference,
  doc,
  PartialWithFieldValue,
  getDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import { auth, firestore } from '@/app/core/lib/firebase';
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
  scheduledAt: Timestamp;
  createdAt: Timestamp;
}

function messagesCollection(): CollectionReference {
  const userId = auth.currentUser?.uid;

  if (!userId) throw new Error('ID de usuário não encontrado!');

  return collection(firestore, `users/${userId}/messages`);
}

export function getMessages$(status: StatusMessage) {
  return collectionData<Message>(
    query(
      messagesCollection(),
      where('status', '==', status),
      orderBy('scheduledAt', 'asc')
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
    })
  );
}

export function useMessages(status: StatusMessage) {
  return useRxValue(getMessages$(status));
}

export function useMessagesCount(status: StatusMessage) {
  return useRxValue(getMessages$(status).pipe(map((msgs) => msgs.length)));
}

export function getMessageById(id: string) {
  return getDoc(doc(messagesCollection(), id));
}

export function createMessage(
  data: PartialWithFieldValue<Message>
) {
  return addDoc(messagesCollection(), {
    ...data,
    createdAt: serverTimestamp(),
    status: StatusMessage.Scheduled,
  });
}
