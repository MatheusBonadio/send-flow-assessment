'use client';

import { useState, useCallback } from 'react';
import { Broadcast } from '@/core/entities/broadcast';
import { CustomModal } from '@/presentation/components/ui';
import { useBroadcasts } from '@/presentation/hooks/useBroadcasts';
import { useAlert } from '@/presentation/providers/AlertProvider';
import { BroadcastForm } from './BroadcastForm';
import { BroadcastModalActions } from './BroadcastModalActions';
import { Connection } from '@/core/entities/connection';
import { Contact } from '@/core/entities/contact';

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
  messageBody: broadcast?.messageBody || '',
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
