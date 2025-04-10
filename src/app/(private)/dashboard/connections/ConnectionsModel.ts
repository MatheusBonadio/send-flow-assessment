import { useEffect, useState } from 'react';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useAlert } from '@/presentation/providers/AlertProvider';
import { FirebaseFirestore } from '@/lib/firebase';
import { map } from 'rxjs/operators';
import {
  doc,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  Query,
  CollectionReference,
} from 'firebase/firestore';
import { createFirestoreObservable } from '@/lib/rxfire';

export interface Connection {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useConnections = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConnection, setSelectedConnection] = useState<
    Connection | undefined
  >(undefined);
  const [connectionCount, setConnectionCount] = useState<number | null>(null);
  const { user } = useAuth();

  const { showAlert } = useAlert();

  if (!user?.uid) throw new Error('ID de usuário não encontrado!');

  const firestore = new FirebaseFirestore().db;
  const connectionsCollection = collection(
    firestore,
    `users/${user.uid}/connections`,
  ) as Query<Connection>;

  useEffect(() => {
    setLoading(true);
    const subscription = createFirestoreObservable(connectionsCollection)
      .pipe(
        map((data) =>
          data.map((doc) => ({
            ...doc,
          })),
        ),
      )
      .subscribe({
        next: (newConnections) => {
          setConnections(newConnections);
          setLoading(false);
        },
        error: (error) => {
          showAlert(String(error), 'error');
          setLoading(false);
        },
      });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const subscription = createFirestoreObservable(connectionsCollection)
      .pipe(map((data) => data.length))
      .subscribe({
        next: (count) => setConnectionCount(count),
        error: (error) => showAlert(String(error), 'error'),
      });

    return () => subscription.unsubscribe();
  }, []);

  const addConnection = async (
    connectionData: Omit<Connection, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    try {
      setLoading(true);
      const newConnectionRef = await addDoc(
        connectionsCollection as CollectionReference,
        {
          ...connectionData,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      );
      showAlert('Conexão adicionada com sucesso!', 'success');
      return { id: newConnectionRef.id, ...connectionData };
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteConnection = async (id: string) => {
    try {
      const connectionDoc = doc(
        firestore,
        `users/${user.uid}/connections/${id}`,
      );
      await deleteDoc(connectionDoc);
      showAlert('Conexão excluída com sucesso!', 'success');
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    }
  };

  const getConnectionById = async (id: string) => {
    try {
      setLoading(true);
      const connectionDoc = doc(
        firestore,
        `users/${user.uid}/connections/${id}`,
      );
      const connection$ = createFirestoreObservable(
        connectionDoc as unknown as Query<Connection>,
      ).pipe(
        map((doc) => ({
          ...doc[0],
        })),
      );

      const subscription = connection$.subscribe({
        next: (connection) => setSelectedConnection(connection as Connection),
        error: (error) => showAlert(String(error), 'error'),
      });

      return () => subscription.unsubscribe();
    } catch (error: unknown) {
      showAlert(String(error), 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateConnection = async (
    id: string,
    connectionData: Partial<Connection>,
  ) => {
    try {
      setLoading(true);
      const connectionDoc = doc(
        firestore,
        `users/${user.uid}/connections/${id}`,
      );
      await updateDoc(connectionDoc, {
        ...connectionData,
        updatedAt: new Date(),
      });
      showAlert('Conexão atualizada com sucesso!', 'success');
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    connections,
    loading,
    connectionCount,
    selectedConnection,
    setSelectedConnection,
    addConnection,
    deleteConnection,
    getConnectionById,
    updateConnection,
  };
};
