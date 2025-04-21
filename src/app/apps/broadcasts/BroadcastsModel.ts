import {
  collection,
  query,
  orderBy,
  serverTimestamp,
  addDoc,
  doc,
  deleteDoc,
  PartialWithFieldValue,
  getDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import { firestore } from '@/app/core/lib/firebase';
import { collectionData } from '@/app/core/lib/rxjs';
import { useRxValue } from '@/app/core/hooks/useRxValue';
import { from, map, switchMap } from 'rxjs';
import { getConnectionById } from '../connections/ConnectionsModel';
import { createMessage } from '../messages/MessagesModel';

export interface Broadcast {
  id: string;
  name: string;
  connectionID: string;
  contactsIDs: string[];
  body: string;
  connectionName?: string;
  userId: string;
  scheduledAt: Timestamp;
  createdAt: Timestamp;
}

export const broadcastsCollection = collection(firestore, 'broadcasts');

export function useBroadcasts(userId: string) {
  return useRxValue(getBroadcasts$(userId));
}

export function useBroadcastsCount(userId: string) {
  return useRxValue(getBroadcastCount$(userId));
}

export function getBroadcasts$(userId: string) {
  return collectionData<Broadcast>(
    query(
      broadcastsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'asc'),
    ),
  ).pipe(
    switchMap((connections) => {
      const enriched$ = connections.map(async (connection) => {
        const connectionSnap = await getConnectionById(connection.connectionID);
        const connectionData = connectionSnap.exists()
          ? connectionSnap.data()
          : null;

        return {
          ...connection,
          connectionName: connectionData?.name,
        };
      });

      return from(Promise.all(enriched$));
    }),
  );
}

export function getBroadcastCount$(userId: string) {
  return collectionData<Broadcast>(
    query(broadcastsCollection, where('userId', '==', userId)),
  ).pipe(map((broadcasts) => broadcasts.length));
}

export function getBroadcastById(id: string) {
  return getDoc(doc(broadcastsCollection, id));
}

export async function createBroadcast(
  userId: string,
  data: PartialWithFieldValue<Broadcast>,
) {
  const broadcastRef = await addDoc(broadcastsCollection, {
    ...data,
    userId,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });

  if (Array.isArray(data.contactsIDs)) {
    for (const contactId of data.contactsIDs) {
      await createMessage(userId, {
        contactID: contactId,
        body: data.body,
        broadcastID: broadcastRef.id,
        broadcastName: data.name,
        scheduledAt: data.scheduledAt,
      });
    }
  }

  return broadcastRef;
}

export function deleteBroadcast(id: string) {
  return deleteDoc(doc(broadcastsCollection, id));
}
