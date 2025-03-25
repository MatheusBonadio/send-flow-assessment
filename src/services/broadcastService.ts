'use server';

import { db, collection, doc, setDoc, getDoc, getDocs, deleteDoc } from '@/infrastructure/firebase/firebase';
import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from "firebase/firestore";
import { getConnection } from './connectionService';
import { addMessage } from './messageService';
import { checkAndUpdateUserDocument, getAuthenticatedUserTokens } from './baseService';

const broadcastsCollection = (userId: string) => collection(db, `users/${userId}/broadcasts`);

export interface IBroadcast {
  id?: string;
  name: string;
  scheduledAt: Date;
  messageBody: string;
  connectionID: string;
  connectionName?: string;
  contactsIDs: string[];
  createdAt?: Date;
}

export const addBroadcast = async (broadcastData: IBroadcast) => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    await checkAndUpdateUserDocument(user.uid);

    broadcastData.id = uuidv4();
    broadcastData.scheduledAt = new Date(broadcastData.scheduledAt);
    broadcastData.createdAt = new Date(); 

    const broadcastRef = doc(broadcastsCollection(user.uid), broadcastData.id);
    await setDoc(broadcastRef, broadcastData);

    for (const contactId of broadcastData.contactsIDs) {
      await addMessage({
        id: uuidv4(),
        body: broadcastData.messageBody,
        contactID: contactId,
        contactName: '',
        broadcastID: broadcastData.id,
        broadcastName: broadcastData.name,
        status: 'scheduled',
        scheduledAt: broadcastData.scheduledAt
      });
    }
  } catch {
    throw new Error("Não foi possível adicionar transmissão");
  }
};

export const getBroadcast = async (broadcastId: string) => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    const broadcastRef = doc(broadcastsCollection(user.uid), broadcastId);
    const docSnap = await getDoc(broadcastRef);

    if (docSnap.exists()) return docSnap.data();
    else return null;
  } catch {
    throw new Error("Não foi possível obter transmissão");
  }
};

export const getAllBroadcasts = async () => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    const querySnapshot = await getDocs(broadcastsCollection(user.uid));
    const broadcastsPromises = querySnapshot.docs.map(async (doc) => {
      const data = doc.data() as IBroadcast;

      const connection = await getConnection(data.connectionID);
      data.connectionName = connection ? connection.name : '';

      return {
        ...data,
        scheduledAt: data.scheduledAt instanceof Timestamp ? data.scheduledAt.toDate() : data.scheduledAt,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt
      };
    });

    const broadcasts = await Promise.all(broadcastsPromises);

    return broadcasts;
  } catch {
    throw new Error("Não foi possível obter todas as transmissões");
  }
};

export const deleteBroadcast = async (broadcastId: string) => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    const broadcastRef = doc(broadcastsCollection(user.uid), broadcastId);
    await deleteDoc(broadcastRef);
  } catch {
    throw new Error("Não foi possível excluir transmissão");
  }
};

export const getBroadcastCount = async (): Promise<number> => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    const querySnapshot = await getDocs(broadcastsCollection(user.uid));
    return querySnapshot.size;
  } catch {
    throw new Error("Não foi possível obter a quantidade de transmissões");
  }
};