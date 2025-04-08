import { useEffect, useState } from 'react';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useAlert } from '@/presentation/providers/AlertProvider';
import { ConnectionRepository } from '@/infrastructure/repositories/connectionRepository';
import { FirebaseFirestore } from '@/lib/firebase';
import { Connection } from '@/core/entities/connection';
import { ConnectionUseCases } from '@/core/useCases/connectionUseCase';

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

  const firestore = new FirebaseFirestore();
  const connectionRepository = new ConnectionRepository(firestore, user.uid);
  const connectionUseCases = new ConnectionUseCases(connectionRepository);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = connectionUseCases.getAll((newConnections) => {
      setConnections(newConnections);
      setLoading(false);
    });

    return () => unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = connectionUseCases.getCount((count) => {
      setConnectionCount(count);
    });

    return () => unsubscribe;
  }, []);

  const addConnection = async (connectionData: Omit<Connection, 'id'>) => {
    try {
      setLoading(true);
      const newConnection = await connectionUseCases.create({
        ...connectionData,
      } as Connection);

      showAlert('Conexão adicionada com sucesso!', 'success');
      return newConnection;
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteConnection = async (id: string) => {
    try {
      await connectionUseCases.delete(id);
      showAlert('Conexão excluída com sucesso!', 'success');
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    }
  };

  const getConnectionById = async (id: string) => {
    try {
      setLoading(true);
      const connection = await connectionUseCases.getById(id);
      setSelectedConnection(connection || undefined);
      return connection;
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
      const updatedConnection = await connectionUseCases.update(
        id,
        connectionData as Connection,
      );
      showAlert('Conexão atualizada com sucesso!', 'success');
      return updatedConnection;
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
