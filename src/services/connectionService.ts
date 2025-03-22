'use server';

import { db, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc } from '@/auth/firebase';
import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from "firebase/firestore";
import { checkAndUpdateUserDocument, getAuthenticatedUserTokens } from './baseService';

const connectionsCollection = (userId: string) => collection(db, `users/${userId}/connections`);

export interface IConnection {
  id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const addConnection = async (connectionData: IConnection) => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    await checkAndUpdateUserDocument(user.uid);

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

export const getConnectionCount = async (): Promise<number> => {
  try {
    const user = (await getAuthenticatedUserTokens()).decodedToken;

    const querySnapshot = await getDocs(connectionsCollection(user.uid));
    return querySnapshot.size;
  } catch {
    throw new Error("Não foi possível obter a quantidade de conexões");
  }
};