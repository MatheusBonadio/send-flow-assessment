'use client';

import React, { useEffect, useState } from 'react';
import {
  getAllContacts,
  addContact,
  updateContact,
  deleteContact,
} from '@/services/contactService';
import ContactTable from './components/ContactTable';
import { Button, CircularProgress } from '@mui/material';

const ContatosPage: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    await addContact(newContact);
    setContacts(await getAllContacts()); // Atualiza a lista de contatos
    alert('Contato adicionado com sucesso!');
  };

  const handleUpdateContact = async (id: string) => {
    const updatedContact = { name: 'Contato Atualizado2', phone: '123456789' };
    await updateContact(id, updatedContact);
    setContacts(await getAllContacts()); // Atualiza a lista de contatos
    alert('Contato atualizado com sucesso!');
  };

  const handleDeleteContact = async (id: string) => {
    await deleteContact(id);
    setContacts(await getAllContacts()); // Atualiza a lista de contatos
    alert('Contato deletado com sucesso!');
  };

  if (loading) return <CircularProgress />;

  return (
    <div>
      <h1>Meus Contatos</h1>
      <Button variant='contained' color='primary' onClick={handleAddContact}>
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

export default ContatosPage;
