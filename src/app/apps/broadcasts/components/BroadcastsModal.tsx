import { useState, useCallback } from 'react';
import { CustomModal } from '@/app/components/ui';
import { useAlert } from '@/app/apps/alert/AlertProvider';
import { BroadcastForm } from './BroadcastsForm';
import { BroadcastModalActions } from './BroadcastsModalActions';
import { Broadcast, createBroadcast } from '../BroadcastsModel';
import { Contact } from '../../contacts/ContactsModel';
import { Connection } from '../../connections/ConnectionsModel';
import { Timestamp } from 'firebase/firestore';

type EditableBroadcastFields = Omit<
  Broadcast,
  'id' | 'createdAt' | 'scheduledAt'
> & {
  scheduledAt: Date;
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
  scheduledAt: broadcast?.scheduledAt?.toDate?.() || new Date(),
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
  const { showAlert } = useAlert();

  const handleBroadcastSubmission = useCallback(
    async (broadcastData: EditableBroadcastFields) => {
      try {
        setIsSubmitting(true);

        await createBroadcast({
          ...broadcastData,
          scheduledAt: Timestamp.fromDate(broadcastData.scheduledAt),
        });

        onClose();
        showAlert('Broadcast criado com sucesso!', 'success');
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Operação falhou';
        showAlert(errorMessage, 'error');
      } finally {
        setIsSubmitting(false);
      }
    },
    [onClose, showAlert],
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
