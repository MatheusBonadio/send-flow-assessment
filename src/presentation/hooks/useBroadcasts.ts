import { useEffect, useState } from 'react';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useAlert } from '@/presentation/providers/AlertProvider';
import { BroadcastRepository } from '@/infrastructure/repositories/broadcastRepository';
import { FirebaseFirestore } from '@/lib/firebase';
import { Broadcast } from '@/core/entities/broadcast';
import { BroadcastUseCases } from '@/core/useCases/broadcastUseCase';

export const useBroadcasts = () => {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBroadcast, setSelectedBroadcast] = useState<
    Broadcast | undefined
  >(undefined);
  const [broadcastCount, setBroadcastCount] = useState<number | null>(null);
  const { user } = useAuth();

  const { showAlert } = useAlert();

  if (!user?.uid) throw new Error('ID de usuário não encontrado!');

  const firestore = new FirebaseFirestore();
  const broadcastRepository = new BroadcastRepository(firestore, user.uid);
  const broadcastUseCases = new BroadcastUseCases(broadcastRepository);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = broadcastUseCases.getAll((newBroadcasts) => {
      setBroadcasts(newBroadcasts);
      setLoading(false);
    });

    return () => unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = broadcastUseCases.getCount((count) => {
      setBroadcastCount(count);
    });

    return () => unsubscribe;
  }, []);

  const addBroadcast = async (broadcastData: Omit<Broadcast, 'id'>) => {
    try {
      setLoading(true);
      const newBroadcast = await broadcastUseCases.create({
        ...broadcastData,
      } as Broadcast);

      showAlert('Transmissão adicionada com sucesso!', 'success');
      return newBroadcast;
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteBroadcast = async (id: string) => {
    try {
      await broadcastUseCases.delete(id);
      showAlert('Transmissão excluída com sucesso!', 'success');
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    }
  };

  const getBroadcastById = async (id: string) => {
    try {
      setLoading(true);
      const broadcast = await broadcastUseCases.getById(id);
      setSelectedBroadcast(broadcast || undefined);
      return broadcast;
    } catch (error: unknown) {
      showAlert(String(error), 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    broadcasts,
    loading,
    broadcastCount,
    selectedBroadcast,
    setSelectedBroadcast,
    addBroadcast,
    deleteBroadcast,
    getBroadcastById,
  };
};
