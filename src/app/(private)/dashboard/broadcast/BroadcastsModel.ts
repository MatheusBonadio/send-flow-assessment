import { useEffect, useState } from 'react';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useAlert } from '@/presentation/providers/AlertProvider';
import { FirebaseFirestore } from '@/lib/firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Query,
  CollectionReference,
  Timestamp,
} from 'firebase/firestore';
import { map } from 'rxjs/operators';
import { createFirestoreObservable } from '@/lib/rxfire';
import { useConnections } from '../connections/ConnectionsModel';
import { useMessages } from '../messages/MessagesModel';

export interface Broadcast {
  id: string;
  name: string;
  connectionID: string;
  contactsIDs: string[];
  body: string;
  scheduledAt: Date;
  status: 'scheduled' | 'sent';
  createdAt: Date;
  connectionName?: string;
}

export const useBroadcasts = () => {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBroadcast, setSelectedBroadcast] = useState<Broadcast | null>(
    null,
  );
  const [broadcastCount, setBroadcastCount] = useState<number | null>(null);

  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { connections } = useConnections();
  const { addMessage } = useMessages();

  if (!user?.uid) throw new Error('ID de usuário não encontrado!');

  const firestore = new FirebaseFirestore().db;
  const broadcastsCollection = collection(
    firestore,
    `users/${user.uid}/broadcasts`,
  ) as Query<Broadcast>;

  useEffect(() => {
    setLoading(true);

    const subscription = createFirestoreObservable(broadcastsCollection)
      .pipe(
        map((data) =>
          data.map((doc) => {
            const scheduledAt =
              doc.scheduledAt instanceof Timestamp
                ? doc.scheduledAt.toDate()
                : doc.scheduledAt;

            const connectionName = connections.find(
              (c) => c.id === doc.connectionID,
            )?.name;

            return {
              ...doc,
              scheduledAt,
              connectionName,
            };
          }),
        ),
      )
      .subscribe({
        next: (newBroadcasts) => {
          setBroadcasts(newBroadcasts);
          setLoading(false);
        },
        error: (error) => {
          showAlert(String(error), 'error');
          setLoading(false);
        },
      });

    return () => subscription.unsubscribe();
  }, [connections]);

  useEffect(() => {
    const subscription = createFirestoreObservable(broadcastsCollection)
      .pipe(map((data) => data.length))
      .subscribe({
        next: (count) => setBroadcastCount(count),
        error: (error) => showAlert(String(error), 'error'),
      });

    return () => subscription.unsubscribe();
  }, []);

  const addBroadcast = async (
    broadcastData: Omit<Broadcast, 'id' | 'createdAt'>,
  ) => {
    try {
      setLoading(true);

      const newBroadcastRef = await addDoc(
        broadcastsCollection as CollectionReference,
        {
          ...broadcastData,
          createdAt: new Date(),
        },
      );

      const messagePromises = broadcastData.contactsIDs.map((contactID) => {
        return addMessage({
          contactID,
          body: broadcastData.body,
          broadcastName: broadcastData.name,
          scheduledAt: broadcastData.scheduledAt,
        });
      });

      await Promise.all(messagePromises);

      showAlert('Broadcast criado com sucesso!', 'success');
      return newBroadcastRef.id;
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteBroadcast = async (id: string) => {
    try {
      const broadcastDoc = doc(firestore, `users/${user.uid}/broadcasts/${id}`);
      await deleteDoc(broadcastDoc);
      showAlert('Broadcast excluído com sucesso!', 'success');
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    }
  };

  return {
    broadcasts,
    loading,
    selectedBroadcast,
    setSelectedBroadcast,
    addBroadcast,
    deleteBroadcast,
    broadcastCount,
  };
};
