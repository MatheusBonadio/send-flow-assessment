'use client';

import React, { useState } from 'react';
import CustomTable from '@/presentation/components/ui/Table';
import ContactModal from './ContactModal';
import CustomDialog from '@/presentation/components/ui/Dialog';
import ContactTableHeader from './ContactTableHeader';
import ContactTableActions from './ContactTableActions';
import { useContacts } from '@/presentation/hooks/useContacts';
import { Contact } from '@/core/entities/contact';

const columns = [
  { id: 'name', label: 'Nome' },
  { id: 'phone', label: 'Telefone' },
  { id: 'actions', label: 'Ações' },
];

const ContactTable: React.FC = () => {
  const {
    contacts,
    loading,
    selectedContact,
    setSelectedContact,
    deleteContact,
  } = useContacts();
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [modalAction, setModalAction] = useState<'create' | 'edit'>('create');

  const handleOpenCreateModal = () => {
    setSelectedContact(undefined);
    setModalAction('create');
    setOpenModal(true);
  };

  const handleOpenEditModal = (contact: Contact) => {
    setSelectedContact(contact);
    setModalAction('edit');
    setOpenModal(true);
  };

  const data = contacts.map((contact) => ({
    id: contact.id,
    name: contact.name,
    phone: contact.phone,
    actions: (
      <ContactTableActions
        onEdit={() => handleOpenEditModal(contact)}
        onDelete={() => {
          setSelectedContact(contact);
          setOpenDialog(true);
        }}
      />
    ),
  }));

  return (
    <>
      <ContactTableHeader onAddContact={handleOpenCreateModal} />
      <div className="flex w-full flex-col items-center justify-between gap-4 p-4 text-black">
        <CustomTable columns={columns} data={data} loading={loading} />

        <ContactModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          contact={modalAction === 'edit' ? selectedContact : undefined}
        />

        {openDialog && (
          <CustomDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onConfirm={() => {
              if (selectedContact?.id) deleteContact(selectedContact.id);
              setOpenDialog(false);
            }}
          />
        )}
      </div>
    </>
  );
};

export default ContactTable;
