'use client';

import React, { useState } from 'react';
import CustomTable from '@/presentation/components/ui/Table';
import BroadcastModal from './BroadcastModal';
import CustomDialog from '@/presentation/components/ui/Dialog';
import BroadcastTableHeader from './BroadcastTableHeader';
import BroadcastTableActions from './BroadcastTableActions';
import { useBroadcasts } from '@/presentation/hooks/useBroadcasts';
import { useConnections } from '@/presentation/hooks/useConnections';
import { useContacts } from '@/presentation/hooks/useContacts';

const columns = [
  { id: 'name', label: 'Nome' },
  { id: 'connectionName', label: 'Conexão' },
  { id: 'scheduledAt', label: 'Hora Agendada' },
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
        onEdit={() => {}}
        onDelete={() => {
          setSelectedBroadcast(broadcast);
          setOpenDialog(true);
        }}
      />
    ),
  }));

  return (
    <>
      <BroadcastTableHeader onAddBroadcast={handleOpenCreateModal} />
      <div className="flex w-full flex-col items-center justify-between gap-4 p-4 text-black">
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
