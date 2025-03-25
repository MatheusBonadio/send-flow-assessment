'use client';

import React, { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomTable from '@/components/ui/Table';
import { IBroadcast } from '@/services/broadcastService';
import { deleteBroadcast } from '@/services/broadcastService';
import BroadcastModal from './BroadcastModal';
import CustomDialog from '@/components/ui/Dialog';
import { useAlert } from '@/utils/AlertProvider';
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/auth/firebase';
import { useAuth } from '@/auth/AuthContext';

const columns = [
  { id: 'name', label: 'Nome' },
  { id: 'connectionName', label: 'Conexão' },
  { id: 'scheduledAt', label: 'Hora Agendada' },
  { id: 'contactsIDs', label: 'Qtd contatos' },
  { id: 'actions', label: 'Ações' },
];

const BroadcastTable: React.FC = () => {
  const [broadcasts, setBroadcasts] = useState<IBroadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBroadcast, setSelectedBroadcast] = useState<
    IBroadcast | undefined
  >(undefined);
  const { showAlert } = useAlert();
  const { user } = useAuth();

  const handleDeleteBroadcast = async () => {
    if (!selectedBroadcast) return;

    try {
      if (selectedBroadcast?.id) await deleteBroadcast(selectedBroadcast.id);

      showAlert('Broadcast excluído com sucesso!', 'success');
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    } finally {
      setOpenDialog(false);
    }
  };

  useEffect(() => {
    const fetchBroadcasts = async () => {
      setLoading(true);

      try {
        const connectionsSnapshot = await getDocs(
          collection(db, `users/${user?.uid}/connections`),
        );
        const connectionsMap = new Map(
          connectionsSnapshot.docs.map((doc) => [doc.id, doc.data().name]),
        );

        const broadcastsQuery = query(
          collection(db, `users/${user?.uid}/broadcasts`),
          orderBy('createdAt', 'asc'),
        );

        const unsubscribeBroadcasts = onSnapshot(
          broadcastsQuery,
          (snapshot) => {
            try {
              const updatedBroadcasts = snapshot.docs.map((doc) => {
                const data = doc.data();

                return {
                  id: doc.id,
                  name: data.name,
                  connectionName: connectionsMap.get(data.connectionID) || '',
                  scheduledAt:
                    data.scheduledAt instanceof Timestamp
                      ? data.scheduledAt.toDate()
                      : data.scheduledAt || null,
                  contactsIDs: data.contactsIDs,
                  messageBody: data.messageBody || '',
                  connectionID: data.connectionID || '',
                  createdAt:
                    data.createdAt instanceof Timestamp
                      ? data.createdAt.toDate()
                      : data.createdAt || null,
                } as IBroadcast;
              });

              setBroadcasts(updatedBroadcasts);
            } catch {
              showAlert('Erro ao processar transmissões', 'error');
            } finally {
              setLoading(false);
            }
          },
          () => {
            showAlert('Erro ao sincronizar transmissões', 'error');
          },
        );

        return () => unsubscribeBroadcasts();
      } catch {
        showAlert('Erro ao carregar contatos', 'error');
        setLoading(false);
      }
    };

    fetchBroadcasts();
  }, [showAlert]);

  const data = broadcasts.map((broadcast) => ({
    id: broadcast.id,
    connectionName: broadcast.connectionName,
    name: broadcast.name,
    scheduledAt: broadcast.scheduledAt.toLocaleString(),
    contactsIDs: broadcast.contactsIDs.length,
    actions: (
      <div className="flex gap-2">
        <IconButton
          aria-label="delete"
          onClick={() => {
            setSelectedBroadcast(broadcast);
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
            setSelectedBroadcast(undefined);
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
        Transmissões
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-4 p-4 text-black">
        <CustomTable columns={columns} data={data} loading={loading} />

        {openModal && (
          <BroadcastModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            broadcast={selectedBroadcast}
          />
        )}

        {openDialog && (
          <CustomDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onConfirm={handleDeleteBroadcast}
          />
        )}
      </div>
    </>
  );
};

export default BroadcastTable;
