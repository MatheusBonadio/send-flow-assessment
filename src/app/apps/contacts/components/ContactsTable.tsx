import { useState } from 'react';
import ContactModal from './ContactsModal';
import ContactTableActions from './ContactsTableActions';
import { Contact, deleteContact, useContacts } from '../ContactsModel';
import { AddButton, CustomDialog, CustomTable } from '@/app/components/ui';
import { useAuth } from '../../auth/useAuth';

const columns = [
  { id: 'name', label: 'Nome' },
  { id: 'phone', label: 'Telefone' },
  { id: 'actions', label: 'Ações' },
];

export default function ContactTable() {
  const { user } = useAuth();

  if (!user) throw new Error('Usuário não encontrado!');

  const contacts = useContacts(user.uid);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [modalAction, setModalAction] = useState<'create' | 'edit'>('create');

  const handleOpenCreateModal = () => {
    setSelectedContact(null);
    setModalAction('create');
    setOpenModal(true);
  };

  const handleOpenEditModal = (contact: Contact) => {
    setSelectedContact(contact);
    setModalAction('edit');
    setOpenModal(true);
  };

  const handleDeleteContact = async () => {
    if (selectedContact?.id) {
      try {
        await deleteContact(selectedContact.id);
        setOpenDialog(false);
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  const data = (contacts ?? []).map((contact) => ({
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
      <div className="flex w-full flex-col justify-between gap-4 p-4 text-black">
        <div className="flex items-center justify-between">
          <AddButton onClick={handleOpenCreateModal} />
        </div>

        <CustomTable columns={columns} data={data} loading={!contacts} />

        <ContactModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          contact={
            modalAction === 'edit' && selectedContact
              ? selectedContact
              : undefined
          }
        />

        <CustomDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={handleDeleteContact}
        />
      </div>
    </>
  );
}
