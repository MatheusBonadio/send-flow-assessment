'use client';

import React, { useEffect, useState } from 'react';
import {
  getAllContacts,
  addContact,
  updateContact,
  deleteContact,
  IContact,
} from '@/services/contactService';
import ContactTable from './components/ContactTable';
import { Button, CircularProgress } from '@mui/material';
import { useAlert } from '@/components/layout/Alert/AlertProvider';

const ContactPage: React.FC = () => {
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const fetchedContacts = await getAllContacts();
        setContacts(fetchedContacts);
      } catch (error) {
        console.error('Erro ao buscar contatos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleAddContact = async () => {
    const newContact = { name: 'Novo Contato', phone: '123456789' };

    try {
      await addContact(newContact);
      showAlert('Usuário criado com sucesso', 'success');
      setContacts(await getAllContacts());
    } catch (error) {
      showAlert('Erro ao adicionar contato: ' + error, 'error');
    }
  };

  const handleUpdateContact = async (id: string) => {
    const updatedContact = { name: 'Contato Atualizado2', phone: '123456789' };

    try {
      await updateContact(id, updatedContact);
      showAlert('Contato atualizado com sucesso', 'success');
      setContacts(await getAllContacts());
    } catch (error) {
      showAlert('Erro ao atualizar contato: ' + error, 'error');
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await deleteContact(id);
      showAlert('Contato excluído com sucesso', 'success');
      setContacts(await getAllContacts());
    } catch (error) {
      showAlert('Erro ao excluir contato: ' + error, 'error');
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <div>
      <h1>Meus Contatos</h1>
      <Button variant="contained" color="primary" onClick={handleAddContact}>
        Adicionar Contato
      </Button>
      <ContactTable
        contacts={contacts}
        onUpdate={handleUpdateContact}
        onDelete={handleDeleteContact}
      />
    </div>
  );
};

export default ContactPage;
