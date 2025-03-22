'use server';

import { db, collection, doc, setDoc, getDoc, getDocs, deleteDoc } from '@/auth/firebase';
import { cookies } from 'next/headers';
import { getTokens } from 'next-firebase-auth-edge';
import { authConfig } from '@/config/serverConfig';
import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from "firebase/firestore";
import { getConnection } from './connectionService';
import { addMessage } from './messageService';

const broadcastsCollection = (userId: string) => collection(db, `users/${userId}/broadcasts`);

export interface IBroadcast {
  id: string;
  name: string;
  scheduledAt: Date;
  messageBody: string;
  connectionID: string;
  connectionName: string;
  contactsIDs: string[];
  createdAt: Date;
}

const getAuthenticatedUserTokens = async () => {
  try {
    const tokens = await getTokens(await cookies(), authConfig);

    if (!tokens) throw new Error("Usuário não autenticado.");

    return tokens;
  } catch {
    throw new Error("Não foi possível obter os tokens do usuário autenticado");
  }
};

export const addBroadcast = async (broadcastData: IBroadcast) => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    broadcastData.id = uuidv4();
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
