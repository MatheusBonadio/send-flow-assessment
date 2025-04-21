import { useState } from 'react';
import ConnectionModal from './ConnectionsModal';
import ConnectionTableActions from './ConnectionsTableActions';
import {
  Connection,
  useConnections,
  deleteConnection,
} from '../ConnectionsModel';
import { AddButton, CustomDialog, CustomTable } from '@/app/components/ui';

const columns = [
  { id: 'name', label: 'Nome' },
  { id: 'actions', label: 'Ações' },
];

export default function ConnectionTable() {
  const connections = useConnections();
  const [selectedConnection, setSelectedConnection] =
    useState<Connection | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [modalAction, setModalAction] = useState<'create' | 'edit'>('create');

  const handleOpenCreateModal = () => {
    setSelectedConnection(null);
    setModalAction('create');
    setOpenModal(true);
  };

  const handleOpenEditModal = (connection: Connection) => {
    setSelectedConnection(connection);
    setModalAction('edit');
    setOpenModal(true);
  };

  const handleDeleteConnection = async () => {
    if (selectedConnection?.id) {
      try {
        await deleteConnection(selectedConnection.id);
        setOpenDialog(false);
      } catch (error) {
        console.error('Error deleting connection:', error);
      }
    }
  };

  const data = (connections ?? []).map((connection) => ({
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
        <div className="flex items-center justify-between">
          <AddButton onClick={handleOpenCreateModal} />
        </div>

        <CustomTable columns={columns} data={data} loading={!connections} />

        <ConnectionModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          connection={
            modalAction === 'edit' && selectedConnection
              ? selectedConnection
              : undefined
          }
        />

        <CustomDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={handleDeleteConnection}
        />
      </div>
    </>
  );
}
