import { useEffect, useState } from 'react';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useAlert } from '@/presentation/providers/AlertProvider';
import { MessageRepository } from '@/infrastructure/repositories/messageRepository';
import { FirebaseFirestore } from '@/lib/firebase';
import { Message } from '@/core/entities/message';
import { MessageUseCases } from '@/core/useCases/messageUseCase';

export const useMessages = () => {
  const [messagesScheduled, setMessagesScheduled] = useState<Message[]>([]);
  const [messagesSent, setMessagesSent] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageCountScheduled, setMessageCountScheduled] = useState<
    number | null
  >(null);
  const [messageCountSent, setMessageCountSent] = useState<number | null>(null);
  const { user } = useAuth();

  const { showAlert } = useAlert();

  if (!user?.uid) throw new Error('ID de usuário não encontrado!');

  const firestore = new FirebaseFirestore();
  const messageRepository = new MessageRepository(firestore, user.uid);
  const messageUseCases = new MessageUseCases(messageRepository);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = messageUseCases.getAllScheduled((newMessages) => {
      setMessagesScheduled(newMessages);
      setLoading(false);
    });

    return () => unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = messageUseCases.getAllSent((newMessages) => {
      setMessagesSent(newMessages);
      setLoading(false);
    });

    return () => unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = messageUseCases.getCountScheduled((count) => {
      setMessageCountScheduled(count);
    });

    return () => unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = messageUseCases.getCountSent((count) => {
      setMessageCountSent(count);
    });

    return () => unsubscribe;
  }, []);

  const addMessage = async (messageData: Omit<Message, 'id'>) => {
    try {
      setLoading(true);
      const newMessage = await messageUseCases.create({
        ...messageData,
      } as Message);

      showAlert('Mensagem adicionada com sucesso!', 'success');
      return newMessage;
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const getMessageById = async (id: string) => {
    try {
      setLoading(true);
      const message = await messageUseCases.getById(id);
      return message;
    } catch (error: unknown) {
      showAlert(String(error), 'error');
      return null;
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
    addMessage,
    getMessageById,
  };
};
