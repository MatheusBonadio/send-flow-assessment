'use server';

import { db, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc } from '@/auth/firebase';
import { v4 as uuidv4 } from 'uuid';

const contactsCollection = (userId: string) => collection(db, `users/${userId}/contacts`);

export interface IContact {
  id: string;
  name: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export const addContact = async (contactData: IContact) => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    await checkAndUpdateUserDocument(user.uid);

    contactData.id = uuidv4();
    contactData.createdAt = new Date();
    contactData.updatedAt = new Date();

    const contactRef = doc(contactsCollection(user.uid), contactData.id);
    await setDoc(contactRef, contactData);
  } catch {
    throw new Error("Não foi possível adicionar contato");
  }
};

export const getContact = async (contactId: string) => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    const contactRef = doc(contactsCollection(user.uid), contactId);
    const docSnap = await getDoc(contactRef);

    if (docSnap.exists()) return docSnap.data();
    else return null;
  } catch {
    throw new Error("Não foi possível obter contato");
  }
};

import { Timestamp } from "firebase/firestore";
import { checkAndUpdateUserDocument, getAuthenticatedUserTokens } from './baseService';

export const getAllContacts = async () => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    await checkAndUpdateUserDocument(user.uid);

    const querySnapshot = await getDocs(contactsCollection(user.uid));
    const contacts: IContact[] = [];

    querySnapshot.forEach(doc => {
      const data = doc.data() as IContact;

      contacts.push({
        ...data,
        id: doc.id,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt
      });
    });

    return contacts;
  } catch {
    throw new Error("Não foi possível obter todos os contatos");
  }
};

export const updateContact = async (contactId: string, updatedData: IContact) => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    updatedData.updatedAt = new Date();

    const contactRef = doc(contactsCollection(user.uid), contactId);
    await updateDoc(contactRef, { ...updatedData });
  } catch {
    throw new Error("Não foi possível atualizar contato");
  }
};

export const deleteContact = async (contactId: string) => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    const contactRef = doc(contactsCollection(user.uid), contactId);
    await deleteDoc(contactRef);
  } catch {
    throw new Error("Não foi possível excluir contato");
  }
};
