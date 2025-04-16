import {
  collection,
  query,
  orderBy,
  serverTimestamp,
  addDoc,
  CollectionReference,
  doc,
  deleteDoc,
  PartialWithFieldValue,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import { auth, firestore } from '@/app/core/lib/firebase';
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
  scheduledAt: Timestamp;
  connectionName?: string;
  createdAt: Timestamp;
}

export function broadcastsCollection(): CollectionReference {
  const userId = auth.currentUser?.uid;
  
  if (!userId) throw new Error('ID de usuário não encontrado!');

  return collection(firestore, `users/${userId}/broadcasts`);
}

export function useBroadcasts() {
  return useRxValue(getBroadcasts$());
}

export function useBroadcastsCount() {
  return useRxValue(getBroadcastCount$());
}

export function getBroadcasts$() {
  return collectionData<Broadcast>(
    query(broadcastsCollection(), orderBy('createdAt', 'asc')),
  ).pipe(
      switchMap((connections) => {
        const enriched$ = connections.map(async (connection) => {
          const connectionSnap = await getConnectionById(connection.connectionID);
          const connectionData = connectionSnap.exists() ? connectionSnap.data() : null;
  
          return {
            ...connection,
            connectionName: connectionData?.name,
          };
        });
  
        return from(Promise.all(enriched$));
      })
    );;
}

export function getBroadcastCount$() {
  return collectionData<Broadcast>(query(broadcastsCollection())).pipe(
    map((broadcasts) => broadcasts.length),
  );
}

export function getBroadcastById(id: string) {
  return getDoc(doc(broadcastsCollection(), id));
}

export async function createBroadcast(
  data: PartialWithFieldValue<Broadcast>,
) {
  const broadcastRef = await addDoc(broadcastsCollection(), {
    ...data,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });

  if (Array.isArray(data.contactsIDs)) {
    for (const contactId of data.contactsIDs) {
      await createMessage({
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
  return deleteDoc(doc(broadcastsCollection(), id));
}