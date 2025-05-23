import { useState, useCallback } from 'react';
import { CustomModal } from '@/app/components/ui';
import { useAlert } from '@/app/apps/alert/AlertProvider';
import { ContactForm } from './ContactsForm';
import { ContactModalActions } from './ContactsModalActions';
import { Contact, createContact, upsertContact } from '../ContactsModel';
import { useAuth } from '../../auth/useAuth';

type EditableContactFields = Omit<
  Contact,
  'id' | 'createdAt' | 'updatedAt' | 'userId'
>;

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
  contact?: Contact;
};

const getDefaultValues = (contact?: Contact): EditableContactFields => ({
  name: contact?.name || '',
  phone: contact?.phone || '',
});

const getModalTitle = (contact?: Contact): string =>
  contact ? 'Editar Contato' : 'Novo Contato';

export default function ContactModal({
  open,
  onClose,
  contact,
}: ContactModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showAlert } = useAlert();
  const { user } = useAuth();

  const handleContactSubmission = useCallback(
    async (contactData: EditableContactFields) => {
      try {
        setIsSubmitting(true);

        if (!user) throw new Error('Usuário não encontrado!');

        if (contact?.id) await upsertContact(contact.id, contactData);
        else await createContact(user.uid, contactData);

        onClose();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Operação falhou';
        showAlert(errorMessage, 'error');
      } finally {
        setIsSubmitting(false);
      }
    },
    [contact, onClose, showAlert],
  );

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={getModalTitle(contact)}
      actions={<ContactModalActions onClose={onClose} loading={isSubmitting} />}
    >
      <ContactForm
        onSubmit={handleContactSubmission}
        defaultValues={getDefaultValues(contact)}
      />
    </CustomModal>
  );
}
