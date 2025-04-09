import { useEffect, useState } from 'react';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useAlert } from '@/presentation/providers/AlertProvider';
import { FirebaseFirestore } from '@/lib/firebase';
import {
  Timestamp,
  Query,
  CollectionReference,
  collection,
  addDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import { createFirestoreObservable } from '@/lib/rxfire';
import { map } from 'rxjs/operators';
import { useMessages } from '../messages/MessagesModel';

export interface Broadcast {
  id: string;
  name: string;
  body: string;
  contactsIDs: string[];
  scheduledAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const useBroadcasts = () => {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBroadcast, setSelectedBroadcast] = useState<
    Broadcast | undefined
  >(undefined);

  const { user } = useAuth();
  const { showAlert } = useAlert();
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
          data.map((doc) => ({
            ...doc,
            scheduledAt:
              doc.scheduledAt instanceof Timestamp
                ? doc.scheduledAt.toDate()
                : doc.scheduledAt,
          })),
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
  }, []);

  const addBroadcast = async (
    broadcastData: Omit<Broadcast, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    try {
      setLoading(true);

      const newBroadcastRef = await addDoc(
        broadcastsCollection as CollectionReference,
        {
          ...broadcastData,
          createdAt: new Date(),
          updatedAt: new Date(),
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

  const getBroadcastById = async (id: string) => {
    try {
      setLoading(true);
      const broadcastDoc = doc(firestore, `users/${user.uid}/broadcasts/${id}`);
      const snapshot = await getDoc(broadcastDoc);
      if (!snapshot.exists()) {
        showAlert('Broadcast não encontrado', 'error');
        return;
      }
      const data = snapshot.data() as Broadcast;
      const enriched: Broadcast = {
        ...data,
        id: snapshot.id,
        scheduledAt:
          data.scheduledAt instanceof Timestamp
            ? data.scheduledAt.toDate()
            : data.scheduledAt,
      };
      setSelectedBroadcast(enriched);
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    broadcasts,
    loading,
    selectedBroadcast,
    setSelectedBroadcast,
    addBroadcast,
    getBroadcastById,
  };
};
