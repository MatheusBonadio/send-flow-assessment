import { useEffect, useState } from 'react';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useAlert } from '@/presentation/providers/AlertProvider';
import { firestore } from '@/lib/firebase';
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
import { useContacts } from '../contacts/ContactsModel';

export interface Message {
  id: string;
  contactID: string;
  contactName?: string;
  body: string;
  broadcastName?: string;
  status: 'scheduled' | 'sent';
  scheduledAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const useMessages = () => {
  const [messagesScheduled, setMessagesScheduled] = useState<Message[]>([]);
  const [messagesSent, setMessagesSent] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | undefined>(
    undefined,
  );
  const [messageCountScheduled, setMessageCountScheduled] = useState<
    number | null
  >(null);
  const [messageCountSent, setMessageCountSent] = useState<number | null>(null);

  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { contacts } = useContacts();

  if (!user?.uid) throw new Error('ID de usuário não encontrado!');

  const messagesCollection = collection(
    firestore,
    `users/${user.uid}/messages`,
  ) as Query<Message>;

  const createStatusQuery = (_status: 'scheduled' | 'sent') =>
    collection(firestore, `users/${user.uid}/messages`) as Query<Message>;

  const enrichMessagesWithContactName = (messages: Message[]): Message[] => {
    return messages.map((message) => {
      const contact = contacts.find((c) => c.id === message.contactID);
      return {
        ...message,
        contactName: contact?.name || 'Desconhecido',
      };
    });
  };

  useEffect(() => {
    setLoading(true);
    const subscription = createFirestoreObservable(
      createStatusQuery('scheduled'),
    )
      .pipe(
        map((data) =>
          data
            .filter((doc) => doc.status === 'scheduled')
            .map((doc) => ({
              ...doc,
              scheduledAt:
                doc.scheduledAt instanceof Timestamp
                  ? doc.scheduledAt.toDate()
                  : doc.scheduledAt,
            })),
        ),
      )
      .subscribe({
        next: (newMessages) => {
          const enriched = enrichMessagesWithContactName(newMessages);
          setMessagesScheduled(enriched);
          setLoading(false);
        },
        error: (error) => {
          showAlert(String(error), 'error');
          setLoading(false);
        },
      });

    return () => subscription.unsubscribe();
  }, [contacts]);

  useEffect(() => {
    setLoading(true);
    const subscription = createFirestoreObservable(createStatusQuery('sent'))
      .pipe(
        map((data) =>
          data
            .filter((doc) => doc.status === 'sent')
            .map((doc) => ({
              ...doc,
              scheduledAt:
                doc.scheduledAt instanceof Timestamp
                  ? doc.scheduledAt.toDate()
                  : doc.scheduledAt,
            })),
        ),
      )
      .subscribe({
        next: (newMessages) => {
          const enriched = enrichMessagesWithContactName(newMessages);
          setMessagesSent(enriched);
          setLoading(false);
        },
        error: (error) => {
          showAlert(String(error), 'error');
          setLoading(false);
        },
      });

    return () => subscription.unsubscribe();
  }, [contacts]);

  useEffect(() => {
    const subscription = createFirestoreObservable(
      createStatusQuery('scheduled'),
    )
      .pipe(map((data) => data.filter((d) => d.status === 'scheduled').length))
      .subscribe({
        next: (count) => setMessageCountScheduled(count),
        error: (error) => showAlert(String(error), 'error'),
      });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const subscription = createFirestoreObservable(createStatusQuery('sent'))
      .pipe(map((data) => data.filter((d) => d.status === 'sent').length))
      .subscribe({
        next: (count) => setMessageCountSent(count),
        error: (error) => showAlert(String(error), 'error'),
      });

    return () => subscription.unsubscribe();
  }, []);

  const addMessage = async (
    messageData: Omit<
      Message,
      'id' | 'createdAt' | 'updatedAt' | 'contactName' | 'status'
    >,
  ) => {
    try {
      setLoading(true);
      const newMessageRef = await addDoc(
        messagesCollection as CollectionReference,
        {
          ...messageData,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'scheduled',
        },
      );
      return { id: newMessageRef.id, ...messageData };
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const getMessageById = async (id: string) => {
    try {
      setLoading(true);
      const messageDoc = doc(firestore, `users/${user.uid}/messages/${id}`);
      const snapshot = await getDoc(messageDoc);
      if (!snapshot.exists()) {
        showAlert('Mensagem não encontrada', 'error');
        return;
      }
      const data = snapshot.data() as Message;
      const contact = contacts.find((c) => c.id === data.contactID);
      const enriched = {
        ...data,
        id: snapshot.id,
        contactName: contact?.name || 'Desconhecido',
        scheduledAt:
          data.scheduledAt instanceof Timestamp
            ? data.scheduledAt.toDate()
            : data.scheduledAt,
      };
      setSelectedMessage(enriched);
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    messagesScheduled,
    messagesSent,
    loading,
    messageCountScheduled,
    messageCountSent,
    selectedMessage,
    setSelectedMessage,
    addMessage,
    getMessageById,
  };
};
