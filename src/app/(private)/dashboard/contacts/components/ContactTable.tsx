'use client';

import React, { useEffect, useState } from 'react';
import { Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CustomTable from '@/components/ui/Table';
import { IContact } from '@/services/contactService';
import { getAllContacts, deleteContact } from '@/services/contactService';
import ContactModal from './ContactModal';
import CustomDialog from '@/components/ui/Dialog';
import { useAlert } from '@/utils/AlertProvider';

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

  const handleDeleteContact = async () => {
    if (!selectedContact) return;

    try {
      if (selectedContact?.id) await deleteContact(selectedContact.id);

      showAlert('Contato excluído com sucesso!', 'success');
      fetchContacts();
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    } finally {
      setOpenDialog(false);
    }
  };

  const fetchContacts = async () => {
    setLoading(true);

    try {
      const fetchedContacts = await getAllContacts();
      setContacts(fetchedContacts);
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

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
    <div className="flex w-full flex-col items-center justify-between gap-4 p-6 text-black">
      <div className="flex w-full flex-row items-center gap-4 text-black">
        <Button
          variant="contained"
          onClick={() => {
            setOpenModal(true);
            setSelectedContact(undefined);
          }}
          startIcon={<AddIcon />}
          sx={{
            borderRadius: 2,
            textTransform: 'initial',
            backgroundColor: '#1b5444',
          }}
        >
          Novo
        </Button>
      </div>

      <CustomTable columns={columns} data={data} loading={loading} />

      {openModal && (
        <ContactModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          refetch={fetchContacts}
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
  );
};

export default ContactTable;
