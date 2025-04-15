import { useState, useCallback } from 'react';
import { CustomModal } from '@/app/core/components/ui';
import { useAlert } from '@/app/apps/alert/AlertProvider';
import { BroadcastForm } from './BroadcastsForm';
import { BroadcastModalActions } from './BroadcastsModalActions';
import { Broadcast, useBroadcasts } from '../BroadcastsModel';
import { Contact } from '../../contacts/ContactsModel';
import { Connection } from '../../connections/ConnectionsModel';

type EditableBroadcastFields = Omit<Broadcast, 'id' | 'createdAt'> & {
  connectionName?: string;
};

type BroadcastModalProps = {
  open: boolean;
  onClose: () => void;
  broadcast?: Broadcast;
  contacts: Omit<Contact, 'phone'>[];
  connections: Connection[];
};

const getDefaultValues = (broadcast?: Broadcast): EditableBroadcastFields => ({
  name: broadcast?.name || '',
  scheduledAt: broadcast?.scheduledAt || new Date(),
  body: broadcast?.body || '',
  connectionID: broadcast?.connectionID || '',
  contactsIDs: broadcast?.contactsIDs || [],
});

const getModalTitle = (broadcast?: Broadcast): string =>
  broadcast ? 'Editar Transmissão' : 'Nova Transmissão';

export default function BroadcastModal({
  open,
  onClose,
  broadcast,
  connections,
  contacts,
}: BroadcastModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addBroadcast } = useBroadcasts();
  const { showAlert } = useAlert();

  const handleBroadcastSubmission = useCallback(
    async (broadcastData: EditableBroadcastFields) => {
      try {
        setIsSubmitting(true);

        await addBroadcast(broadcastData);

        onClose();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Operação falhou';
        showAlert(errorMessage, 'error');
      } finally {
        setIsSubmitting(false);
      }
    },
    [onClose, addBroadcast, showAlert],
  );

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={getModalTitle(broadcast)}
      actions={
        <BroadcastModalActions onClose={onClose} loading={isSubmitting} />
      }
    >
      <BroadcastForm
        onSubmit={handleBroadcastSubmission}
        defaultValues={getDefaultValues(broadcast)}
        contacts={contacts}
        connections={connections}
      />
    </CustomModal>
  );
}
