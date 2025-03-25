'use client';

import React, { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CustomTable from '@/components/ui/Table';
import { IContact } from '@/services/contactService';
import { deleteContact } from '@/services/contactService';
import ContactModal from './ContactModal';
import CustomDialog from '@/components/ui/Dialog';
import { useAlert } from '@/utils/AlertProvider';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/infraestructure/firebase/firebase';
import { useAuth } from '@/auth/AuthContext';

const columns = [
  { id: 'name', label: 'Nome' },
  { id: 'phone', label: 'Telefone' },
  { id: 'actions', label: 'Ações' },
];

const ContactTable: React.FC = () => {
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState<IContact | undefined>(
    undefined,
  );
  const { showAlert } = useAlert();
  const { user } = useAuth();

  const handleDeleteContact = async () => {
    if (!selectedContact) return;

    try {
      if (selectedContact?.id) await deleteContact(selectedContact.id);

      showAlert('Contato excluído com sucesso!', 'success');
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    } finally {
      setOpenDialog(false);
    }
  };

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);

      try {
        const contactsQuery = query(
          collection(db, `users/${user?.uid}/contacts`),
          orderBy('createdAt', 'asc'),
        );

        const unsubscribeContacts = onSnapshot(
          contactsQuery,
          (snapshot) => {
            const updatedContacts = snapshot.docs.map((doc) => ({
              ...doc.data(),
            })) as IContact[];

            setContacts(updatedContacts);
            setLoading(false);
          },
          () => {
            showAlert('Erro ao sincronizar contatos', 'error');
          },
        );
        return () => unsubscribeContacts();
      } catch {
        showAlert('Erro ao carregar contatos', 'error');
        setLoading(false);
      }
    };

    fetchContacts();
  }, [showAlert]);

  const data = contacts.map((contact) => ({
    id: contact.id,
    name: contact.name,
    phone: contact.phone,
    actions: (
      <div className="flex gap-2">
        <IconButton
          aria-label="edit"
          onClick={() => {
            setSelectedContact(contact);
            setOpenModal(true);
          }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          aria-label="delete"
          onClick={() => {
            setSelectedContact(contact);
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
            setSelectedContact(undefined);
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
        Contatos
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-4 p-4 text-black">
        <CustomTable columns={columns} data={data} loading={loading} />

        {openModal && (
          <ContactModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            contact={selectedContact}
          />
        )}

        {openDialog && (
          <CustomDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onConfirm={handleDeleteContact}
          />
        )}
      </div>
    </>
  );
};

export default ContactTable;
