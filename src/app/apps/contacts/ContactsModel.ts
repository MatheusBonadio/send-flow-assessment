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
  Timestamp,
  where,
} from 'firebase/firestore';
import { firestore } from '@/app/core/lib/firebase';
import { collectionData } from '@/app/core/lib/rxjs';
import { useRxValue } from '@/app/core/hooks/useRxValue';
import { map } from 'rxjs';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const contactsCollection = collection(firestore, 'contacts');

export function useContacts(userId: string) {
  return useRxValue(getContacts$(userId));
}

export function useContactsCount(userId: string) {
  return useRxValue(getContactCount$(userId));
}

export function getContacts$(userId: string) {
  return collectionData<Contact>(
    query(
      contactsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'asc'),
    ),
  );
}

export function getContactCount$(userId: string) {
  return collectionData<Contact>(
    query(contactsCollection, where('userId', '==', userId)),
  ).pipe(map((contacts) => contacts.length));
}

export function getContactById(id: string) {
  return getDoc(doc(contactsCollection, id));
}

export function createContact(
  userId: string,
  data: PartialWithFieldValue<Contact>,
) {
  return addDoc(contactsCollection, {
    ...data,
    userId,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
}

export function upsertContact(
  id: string,
  data: PartialWithFieldValue<Contact>,
) {
  return setDoc(
    doc(contactsCollection, id),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export function deleteContact(id: string) {
  return deleteDoc(doc(contactsCollection, id));
}
