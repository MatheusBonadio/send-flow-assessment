import React, { useState } from 'react';
import BroadcastModal from './BroadcastsModal';
import BroadcastTableActions from './BroadcastsTableActions';
import { useBroadcasts } from '../BroadcastsModel';
import { useContacts } from '../../contacts/ContactsModel';
import { useConnections } from '../../connections/ConnectionsModel';
import { AddButton, CustomDialog, CustomTable } from '@/app/core/components/ui';

const columns = [
  { id: 'name', label: 'Nome' },
  { id: 'connectionName', label: 'Conexão' },
  { id: 'scheduledAt', label: 'Agendado para' },
  { id: 'contactsIDs', label: 'Qtd contatos' },
  { id: 'actions', label: 'Ações' },
];

const BroadcastTable: React.FC = () => {
  const {
    broadcasts,
    loading,
    selectedBroadcast,
    setSelectedBroadcast,
    deleteBroadcast,
  } = useBroadcasts();
  const { contacts } = useContacts();
  const { connections } = useConnections();
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [modalAction, setModalAction] = useState<'create' | 'edit'>('create');

  const handleOpenCreateModal = () => {
    setSelectedBroadcast(undefined);
    setModalAction('create');
    setOpenModal(true);
  };

  const data = broadcasts.map((broadcast) => ({
    id: broadcast.id,
    connectionName: broadcast.connectionName,
    name: broadcast.name,
    scheduledAt: broadcast.scheduledAt.toLocaleString(),
    contactsIDs: broadcast.contactsIDs.length,
    actions: (
      <BroadcastTableActions
        onDelete={() => {
          setSelectedBroadcast(broadcast);
          setOpenDialog(true);
        }}
      />
    ),
  }));

  return (
    <>
      <div className="flex w-full flex-col justify-between gap-4 p-4 text-black">
        <div>
          <AddButton onClick={handleOpenCreateModal} />
        </div>

        <CustomTable columns={columns} data={data} loading={loading} />

        <BroadcastModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          broadcast={modalAction === 'edit' ? selectedBroadcast : undefined}
          contacts={contacts}
          connections={connections}
        />

        {openDialog && (
          <CustomDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onConfirm={() => {
              if (selectedBroadcast?.id) deleteBroadcast(selectedBroadcast.id);
              setOpenDialog(false);
            }}
          />
        )}
      </div>
    </>
  );
};

export default BroadcastTable;
