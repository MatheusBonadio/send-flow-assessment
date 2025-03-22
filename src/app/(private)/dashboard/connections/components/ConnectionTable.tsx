'use client';

import React, { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CustomTable from '@/components/ui/Table';
import { IConnection } from '@/services/connectionService';
import {
  getAllConnections,
  deleteConnection,
} from '@/services/connectionService';
import ConnectionModal from './ConnectionModal';
import CustomDialog from '@/components/ui/Dialog';
import { useAlert } from '@/utils/AlertProvider';

const columns = [
  { id: 'name', label: 'Nome' },
  { id: 'actions', label: 'Ações' },
];

const ConnectionTable: React.FC = () => {
  const [connections, setConnections] = useState<IConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<
    IConnection | undefined
  >(undefined);
  const { showAlert } = useAlert();

  const handleDeleteConnection = async () => {
    if (!selectedConnection) return;

    try {
      if (selectedConnection?.id) await deleteConnection(selectedConnection.id);

      showAlert('Conexão excluída com sucesso!', 'success');
      fetchConnections();
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    } finally {
      setOpenDialog(false);
    }
  };

  const fetchConnections = async () => {
    setLoading(true);

    try {
      const fetchedConnections = await getAllConnections();
      setConnections(fetchedConnections);
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const data = connections.map((connection) => ({
    id: connection.id,
    name: connection.name,
    actions: (
      <div className="flex gap-2">
        <IconButton
          aria-label="edit"
          onClick={() => {
            setSelectedConnection(connection);
            setOpenModal(true);
          }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          aria-label="delete"
          onClick={() => {
            setSelectedConnection(connection);
            setOpenDialog(true);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    ),
  }));

  return (
    <>
      <div
        className="flex h-13 items-center gap-3 px-4 font-semibold"
        style={{ borderBottom: '1px solid #e4e4e7' }}
      >
        <IconButton
          onClick={() => {
            setOpenModal(true);
            setSelectedConnection(undefined);
          }}
          sx={{
            backgroundColor: '#007a55',
            color: 'white',
            '&:hover': {
              backgroundColor: '#164c3b',
            },
            padding: '.3rem',
            borderRadius: '.5rem',
          }}
        >
          <AddIcon style={{ fontSize: '18px' }} />
        </IconButton>
        Conexões
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-4 p-4 text-black">
        <CustomTable columns={columns} data={data} loading={loading} />

        {openModal && (
          <ConnectionModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            refetch={fetchConnections}
            connection={selectedConnection}
          />
        )}

        {openDialog && (
          <CustomDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onConfirm={handleDeleteConnection}
          />
        )}
      </div>
    </>
  );
};

export default ConnectionTable;
