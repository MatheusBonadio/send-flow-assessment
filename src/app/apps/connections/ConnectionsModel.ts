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
} from 'firebase/firestore';
import { auth, firestore } from '@/app/core/lib/firebase';
import { collectionData } from '@/app/core/lib/rxjs';
import { useRxValue } from '@/app/core/hooks/useRxValue';
import { map } from 'rxjs';

export interface Connection {
  id: string;
  name: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export function connectionsCollection(): CollectionReference {
  const userId = auth.currentUser?.uid;
  
  if (!userId) throw new Error('ID de usuário não encontrado!');

  return collection(firestore, `users/${userId}/connections`);
}

export function useConnections() {
  return useRxValue(getConnections$());
}

export function useConnectionsCount() {
  return useRxValue(getConnectionCount$());
}

export function getConnections$() {
  return collectionData<Connection>(
    query(connectionsCollection(), orderBy('createdAt', 'asc')),
  );
}

export function getConnectionCount$() {
  return collectionData<Connection>(query(connectionsCollection())).pipe(
    map((connections) => connections.length),
  );
}

export function getConnectionById(id: string) {
  return getDoc(doc(connectionsCollection(), id));
}

export function createConnection(
  data: PartialWithFieldValue<Connection>,
) {
  return addDoc(connectionsCollection(), {
    ...data,
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