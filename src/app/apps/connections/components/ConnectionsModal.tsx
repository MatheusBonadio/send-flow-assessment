import { useState, useCallback } from 'react';
import { CustomModal } from '@/app/components/ui';
import { useAlert } from '@/app/apps/alert/AlertProvider';
import { ConnectionForm } from './ConnectionsForm';
import { ConnectionModalActions } from './ConnectionsModalActions';
import { Connection, useConnections } from '../ConnectionsModel';

type EditableConnectionFields = Omit<
  Connection,
  'id' | 'createdAt' | 'updatedAt'
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
  const { addConnection, updateConnection } = useConnections();
  const { showAlert } = useAlert();

  const handleConnectionSubmission = useCallback(
    async (connectionData: EditableConnectionFields) => {
      try {
        setIsSubmitting(true);

        if (connection?.id)
          await updateConnection(connection.id, {
            ...connection,
            ...connectionData,
          });
        else await addConnection(connectionData);

        onClose();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Operação falhou';
        showAlert(errorMessage, 'error');
      } finally {
        setIsSubmitting(false);
      }
    },
    [connection, onClose, addConnection, updateConnection, showAlert],
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
