import { useState, useCallback } from 'react';
import { CustomModal } from '@/app/components/ui';
import { useAlert } from '@/app/apps/alert/AlertProvider';
import { ConnectionForm } from './ConnectionsForm';
import { ConnectionModalActions } from './ConnectionsModalActions';
import {
  Connection,
  createConnection,
  upsertConnection,
} from '../ConnectionsModel';
import { useAuth } from '../../auth/useAuth';

type EditableConnectionFields = Omit<
  Connection,
  'id' | 'createdAt' | 'updatedAt' | 'userId'
>;

type ConnectionModalProps = {
  open: boolean;
  onClose: () => void;
  connection?: Connection;
};

const getDefaultValues = (
  connection?: Connection,
): EditableConnectionFields => ({
  name: connection?.name || '',
});

const getModalTitle = (connection?: Connection): string =>
  connection ? 'Editar Conexão' : 'Nova Conexão';

export default function ConnectionModal({
  open,
  onClose,
  connection,
}: ConnectionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showAlert } = useAlert();
  const { user } = useAuth();

  const handleConnectionSubmission = useCallback(
    async (connectionData: EditableConnectionFields) => {
      try {
        setIsSubmitting(true);

        if (!user) throw new Error('Usuário não encontrado!');

        if (connection?.id)
          await upsertConnection(connection.id, connectionData);
        else await createConnection(user.uid, connectionData);

        onClose();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Operação falhou';
        showAlert(errorMessage, 'error');
      } finally {
        setIsSubmitting(false);
      }
    },
    [connection, onClose, showAlert],
  );

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={getModalTitle(connection)}
      actions={
        <ConnectionModalActions onClose={onClose} loading={isSubmitting} />
      }
    >
      <ConnectionForm
        onSubmit={handleConnectionSubmission}
        defaultValues={getDefaultValues(connection)}
      />
    </CustomModal>
  );
}
