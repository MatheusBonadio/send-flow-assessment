import { useEffect, useState } from 'react';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useAlert } from '@/presentation/providers/AlertProvider';
import { FirebaseFirestore } from '@/lib/firebase';
import { map } from 'rxjs/operators';
import {
  doc,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  Query,
  CollectionReference,
} from 'firebase/firestore';
import { createFirestoreObservable } from '@/lib/rxfire';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>(
    undefined,
  );
  const [contactCount, setContactCount] = useState<number | null>(null);
  const { user } = useAuth();

  const { showAlert } = useAlert();

  if (!user?.uid) throw new Error('ID de usuário não encontrado!');

  const firestore = new FirebaseFirestore().db;
  const contactsCollection = collection(
    firestore,
    `users/${user.uid}/contacts`,
  ) as Query<Contact>;

  useEffect(() => {
    setLoading(true);
    const subscription = createFirestoreObservable(contactsCollection)
      .pipe(
        map((data) =>
          data.map((doc) => ({
            ...doc,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          })),
        ),
      )
      .subscribe({
        next: (newContacts) => {
          setContacts(newContacts);
          setLoading(false);
        },
        error: (error) => {
          showAlert(String(error), 'error');
          setLoading(false);
        },
      });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const subscription = createFirestoreObservable(contactsCollection)
      .pipe(map((data) => data.length))
      .subscribe({
        next: (count) => setContactCount(count),
        error: (error) => showAlert(String(error), 'error'),
      });

    return () => subscription.unsubscribe();
  }, []);

  const addContact = async (
    contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    try {
      setLoading(true);
      const newContactRef = await addDoc(
        contactsCollection as CollectionReference,
        {
          ...contactData,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      );
      showAlert('Contato adicionado com sucesso!', 'success');
      return { id: newContactRef.id, ...contactData };
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const contactDoc = doc(firestore, `users/${user.uid}/contacts/${id}`);
      await deleteDoc(contactDoc);
      showAlert('Contato excluído com sucesso!', 'success');
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    }
  };

  const getContactById = async (id: string) => {
    try {
      setLoading(true);
      const contactDoc = doc(firestore, `users/${user.uid}/contacts/${id}`);
      const contact$ = createFirestoreObservable(
        contactDoc as unknown as Query<Contact>,
      ).pipe(
        map((doc) => ({
          ...doc[0],
          createdAt: doc[0].createdAt,
          updatedAt: doc[0].updatedAt,
        })),
      );

      const subscription = contact$.subscribe({
        next: (contact) => setSelectedContact(contact as Contact),
        error: (error) => showAlert(String(error), 'error'),
      });

      return () => subscription.unsubscribe();
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
      const contactDoc = doc(firestore, `users/${user.uid}/contacts/${id}`);
      await updateDoc(contactDoc, {
        ...contactData,
        updatedAt: new Date(),
      });
      showAlert('Contato atualizado com sucesso!', 'success');
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
