import React, { useState } from 'react';
import CustomTable from '@/presentation/components/ui/Table';
import ConnectionModal from './ConnectionModal';
import CustomDialog from '@/presentation/components/ui/Dialog';
import ConnectionTableActions from './ConnectionTableActions';
import { useConnections } from '@/presentation/hooks/useConnections';
import { Connection } from '@/core/entities/connection';
import AddButton from '@/presentation/components/ui/AddButton';

const columns = [
  { id: 'name', label: 'Nome' },
  { id: 'actions', label: 'Ações' },
];

const ConnectionTable: React.FC = () => {
  const {
    connections,
    loading,
    selectedConnection,
    setSelectedConnection,
    deleteConnection,
  } = useConnections();
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [modalAction, setModalAction] = useState<'create' | 'edit'>('create');

  const handleOpenCreateModal = () => {
    setSelectedConnection(undefined);
    setModalAction('create');
    setOpenModal(true);
  };

  const handleOpenEditModal = (connection: Connection) => {
    setSelectedConnection(connection);
    setModalAction('edit');
    setOpenModal(true);
  };

  const data = connections.map((connection) => ({
    id: connection.id,
    name: connection.name,
    actions: (
      <ConnectionTableActions
        onEdit={() => handleOpenEditModal(connection)}
        onDelete={() => {
          setSelectedConnection(connection);
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

        <ConnectionModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          connection={modalAction === 'edit' ? selectedConnection : undefined}
        />

        {openDialog && (
          <CustomDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onConfirm={() => {
              if (selectedConnection?.id)
                deleteConnection(selectedConnection.id);
              setOpenDialog(false);
            }}
          />
        )}
      </div>
    </>
  );
};

export default ConnectionTable;
