import { useEffect, useState } from 'react';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { useAlert } from '@/presentation/providers/AlertProvider';
import { ContactRepository } from '@/infrastructure/repositories/contactRepository';
import { FirebaseFirestore } from '@/infrastructure/firebase/firestore';
import { Contact } from '@/core/entities/contact';
import { ContactUseCases } from '@/core/useCases/contactUseCase';

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>(undefined);
  const [contactCount, setContactCount] = useState<number | null>(null);
  const { user } = useAuth();

  const { showAlert } = useAlert();
  
  if (!user?.uid) 
    throw new Error('ID de usuário não encontrado!');

  const firestore = new FirebaseFirestore();
  const contactRepository = new ContactRepository(firestore, user.uid);
  const contactUseCases = new ContactUseCases(contactRepository);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = contactUseCases.getAll((newContacts) => {
      setContacts(newContacts);
      setLoading(false);
    });

    return () => unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = contactUseCases.getCount((count) => {
      setContactCount(count);
    });
    
    return () => unsubscribe;
  }, []);

  const addContact = async (contactData: Omit<Contact, 'id'>) => {
    try {
      setLoading(true);
      const newContact = await contactUseCases.create({
        ...contactData,
      } as Contact);
      
      showAlert('Contato adicionado com sucesso!', 'success');
      return newContact;
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id: string) => {
    try {
      await contactUseCases.delete(id);
      showAlert('Contato excluído com sucesso!', 'success');
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    }
  };

  const getContactById = async (id: string) => {
    try {
      setLoading(true);
      const contact = await contactUseCases.getById(id);
      setSelectedContact(contact || undefined);
      return contact;
    } catch (error: unknown) {
      showAlert(String(error), 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateContact = async (id: string, contactData: Partial<Contact>) => {
    try {
      setLoading(true);
      const updatedContact = await contactUseCases.update(id, contactData as Contact);
      showAlert('Contato atualizado com sucesso!', 'success');
      return updatedContact;
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    contacts,
    loading,
    contactCount,
    selectedContact,
    setSelectedContact,
    addContact,
    deleteContact,
    getContactById,
    updateContact,
  };
};