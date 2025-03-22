'use server';

import { db, collection, doc, setDoc, getDoc, getDocs } from '@/auth/firebase';
import { cookies } from 'next/headers';
import { getTokens } from 'next-firebase-auth-edge';
import { authConfig } from '@/config/serverConfig';
import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from 'firebase/firestore';
import { getContact } from './contactService';

const messagesCollection = (userId: string) => collection(db, `users/${userId}/messages`);

export interface IMessage {
  id: string;
  body: string;
  contactID: string;
  contactName: string;
  broadcastID: string;
  broadcastName: string;
  status: 'scheduled' | 'sent';
  scheduledAt: Date;
}

const getAuthenticatedUserTokens = async () => {  
  try {
    const tokens = await getTokens(await cookies(), authConfig);

    if (!tokens) throw new Error('Usuário não autenticado.');

    return tokens;
  } catch {
    throw new Error('Não foi possível obter os tokens do usuário autenticado');
  }
};

export const addMessage = async (messageData: IMessage) => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    messageData.id = uuidv4();
    const messageRef = doc(messagesCollection(user.uid), messageData.id);

    await setDoc(messageRef, messageData);
  } catch {
    throw new Error('Não foi possível adicionar mensagem');
  }
};

export const getMessage = async (messageId: string) => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    const messageRef = doc(messagesCollection(user.uid), messageId);
    const docSnap = await getDoc(messageRef);

    if (docSnap.exists()) return docSnap.data() as IMessage;
    else return null;
  } catch {
    throw new Error('Não foi possível obter mensagem');
  }
};

export const getAllMessages = async () => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    const querySnapshot = await getDocs(messagesCollection(user.uid));
    const messages: IMessage[] = [];

    querySnapshot.forEach(doc => {
      const data = doc.data() as IMessage;

      messages.push({
        ...data,
        id: doc.id,
        scheduledAt: data.scheduledAt instanceof Timestamp ? data.scheduledAt.toDate() : data.scheduledAt,
      });
    });

    return messages;
  } catch {
    throw new Error("Não foi possível obter todos os contatos");
  }
};

const getAllMessagesByStatus = async (status: 'scheduled' | 'sent') => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    const querySnapshot = await getDocs(messagesCollection(user.uid));
    const messagesPromises = querySnapshot.docs.map(async (doc) => {
      const data = doc.data() as IMessage;

      const contact = await getContact(data.contactID);
      data.contactName = contact ? contact.name : '';

      return {
        ...data,
        id: doc.id,
        scheduledAt: data.scheduledAt instanceof Timestamp ? data.scheduledAt.toDate() : data.scheduledAt,
      };
    });

    const messages = await Promise.all(messagesPromises);

    return messages.filter((message) => message.status === status);
  } catch {
    throw new Error(`Não foi possível obter as mensagens com status "${status}"`);
  }
};


export const getAllMessagesScheduled = async () => getAllMessagesByStatus('scheduled');
export const getAllMessagesSent = async() => getAllMessagesByStatus('sent');
