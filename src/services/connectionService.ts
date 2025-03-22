'use server';

import { db, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc } from '@/auth/firebase';
import { cookies } from 'next/headers';
import { getTokens } from 'next-firebase-auth-edge';
import { authConfig } from '@/config/serverConfig';
import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from "firebase/firestore";

const connectionsCollection = (userId: string) => collection(db, `users/${userId}/connections`);

export interface IConnection {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
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

export const addConnection = async (connectionData: IConnection) => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    connectionData.id = uuidv4();
    connectionData.createdAt = new Date();
    connectionData.updatedAt = new Date();

    const connectionRef = doc(connectionsCollection(user.uid), connectionData.id);
    await setDoc(connectionRef, connectionData);
  } catch {
    throw new Error("Não foi possível adicionar conexão");
  }
};

export const getConnection = async (connectionId: string) => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    const connectionRef = doc(connectionsCollection(user.uid), connectionId);
    const docSnap = await getDoc(connectionRef);

    if (docSnap.exists()) return docSnap.data();
    else return null;
  } catch {
    throw new Error("Não foi possível obter conexão");
  }
};

export const getAllConnections = async () => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    const querySnapshot = await getDocs(connectionsCollection(user.uid));
    const connections: IConnection[] = [];

    querySnapshot.forEach(doc => {
      const data = doc.data() as IConnection;

      connections.push({
        ...data,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt
      });
    });

    return connections;
  } catch {
    throw new Error("Não foi possível obter todas as conexões");
  }
};

export const updateConnection = async (connectionId: string, updatedData: IConnection) => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    updatedData.updatedAt = new Date();

    const connectionRef = doc(connectionsCollection(user.uid), connectionId);
    await updateDoc(connectionRef, { ...updatedData });
  } catch {
    throw new Error("Não foi possível atualizar conexão");
  }
};

export const deleteConnection = async (connectionId: string) => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    const connectionRef = doc(connectionsCollection(user.uid), connectionId);
    await deleteDoc(connectionRef);
  } catch {
    throw new Error("Não foi possível excluir conexão");
  }
};
