'use server';

import { db, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc } from '@/auth/firebase';
import { cookies } from 'next/headers';
import { getTokens } from 'next-firebase-auth-edge';
import { authConfig } from '@/config/serverConfig';
import { v4 as uuidv4 } from 'uuid';

const contactsCollection = (userId: string) => collection(db, `users/${userId}/contacts`);

export interface IContact {
  id?: string;
  name?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const getAuthenticatedUserTokens = async () => {
  try {
    const tokens = await getTokens(await cookies(), authConfig);

    if (!tokens) throw new Error("Usuário não autenticado.");

    return tokens;
  } catch (error) {
    console.error("Error getting authenticated user tokens:", error);
    throw error;
  }
};

export const addContact = async (contactData: IContact) => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    contactData.createdAt = new Date();
    contactData.updatedAt = new Date();

    const contactRef = doc(contactsCollection(user.uid), uuidv4());
    await setDoc(contactRef, contactData);
  } catch (error) {
    console.error("Error adding contact:", error);
    throw error;
  }
};

export const getContact = async (contactId: string) => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    const contactRef = doc(contactsCollection(user.uid), contactId);
    const docSnap = await getDoc(contactRef);

    if (docSnap.exists()) return docSnap.data();
    else return null;
  } catch (error) {
    console.error("Error getting contact:", error);
    throw error;
  }
};

import { Timestamp } from "firebase/firestore";

export const getAllContacts = async () => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    const querySnapshot = await getDocs(contactsCollection(user.uid));
    const contacts: IContact[] = [];

    querySnapshot.forEach(doc => {
      const data = doc.data() as IContact;

      contacts.push({
        id: doc.id,
        ...data,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt
      });
    });

    return contacts;
  } catch (error) {
    console.error("Error getting all contacts:", error);
    throw error;
  }
};

export const updateContact = async (contactId: string, updatedData: IContact) => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    updatedData.updatedAt = new Date();

    const contactRef = doc(contactsCollection(user.uid), contactId);
    await updateDoc(contactRef, { ...updatedData });
  } catch (error) {
    console.error("Error updating contact:", error);
    throw error;
  }
};

export const deleteContact = async (contactId: string) => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    const contactRef = doc(contactsCollection(user.uid), contactId);
    await deleteDoc(contactRef);
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw error;
  }
};
