import {
  collection,
  query,
  orderBy,
  serverTimestamp,
  addDoc,
  CollectionReference,
  setDoc,
  doc,
  deleteDoc,
  PartialWithFieldValue,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import { auth, firestore } from '@/app/core/lib/firebase';
import { collectionData } from '@/app/core/lib/rxjs';
import { useRxValue } from '@/app/core/hooks/useRxValue';
import { map } from 'rxjs';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export function contactsCollection(): CollectionReference {
  const userId = auth.currentUser?.uid;
  
  if (!userId) throw new Error('ID de usuário não encontrado!');

  return collection(firestore, `users/${userId}/contacts`);
}

export function useContacts() {
  return useRxValue(getContacts$());
}

export function useContactsCount() {
  return useRxValue(getContactCount$());
}

export function getContacts$() {
  return collectionData<Contact>(
    query(contactsCollection(), orderBy('createdAt', 'asc')),
  );
}

export function getContactCount$() {
  return collectionData<Contact>(query(contactsCollection())).pipe(
    map((contacts) => contacts.length),
  );
}

export function getContactById(id: string) {
  return getDoc(doc(contactsCollection(), id));
}

export function createContact(
  data: PartialWithFieldValue<Contact>,
) {
  return addDoc(contactsCollection(), {
    ...data,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
}

export function upsertContact(
  id: string,
  data: PartialWithFieldValue<Contact>,
) {
  return setDoc(
    doc(contactsCollection(), id),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export function deleteContact(id: string) {
  return deleteDoc(doc(contactsCollection(), id));
}
