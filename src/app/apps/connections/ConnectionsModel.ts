import {
  collection,
  query,
  orderBy,
  serverTimestamp,
  addDoc,
  setDoc,
  doc,
  deleteDoc,
  PartialWithFieldValue,
  getDoc,
  CollectionReference,
  Timestamp,
  where,
} from 'firebase/firestore';
import { firestore } from '@/app/core/lib/firebase';
import { collectionData } from '@/app/core/lib/rxjs';
import { useRxValue } from '@/app/core/hooks/useRxValue';
import { map } from 'rxjs';

export interface Connection {
  id: string;
  name: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export function connectionsCollection(): CollectionReference {
  return collection(firestore, 'connections');
}

export function useConnections(userId: string) {
  return useRxValue(getConnections$(userId));
}

export function useConnectionsCount(userId: string) {
  return useRxValue(getConnectionCount$(userId));
}

export function getConnections$(userId: string) {
  return collectionData<Connection>(
    query(
      connectionsCollection(),
      where('userId', '==', userId),
      orderBy('createdAt', 'asc'),
    ),
  );
}

export function getConnectionCount$(userId: string) {
  return collectionData<Connection>(
    query(connectionsCollection(), where('userId', '==', userId)),
  ).pipe(map((connections) => connections.length));
}

export function getConnectionById(id: string) {
  return getDoc(doc(connectionsCollection(), id));
}

export function createConnection(
  userId: string,
  data: PartialWithFieldValue<Connection>,
) {
  return addDoc(connectionsCollection(), {
    ...data,
    userId,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
}

export function upsertConnection(
  id: string,
  data: PartialWithFieldValue<Connection>,
) {
  return setDoc(
    doc(connectionsCollection(), id),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export function deleteConnection(id: string) {
  return deleteDoc(doc(connectionsCollection(), id));
}
