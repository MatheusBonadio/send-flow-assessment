import { useState, useCallback } from 'react';
import { CustomModal } from '@/app/components/ui';
import { useAlert } from '@/app/apps/alert/AlertProvider';
import { ContactForm } from './ContactsForm';
import { ContactModalActions } from './ContactsModalActions';
import { Contact, useContacts } from '../ContactsModel';

type EditableContactFields = Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>;
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
  const { addContact, updateContact } = useContacts();
  const { showAlert } = useAlert();

  const handleContactSubmission = useCallback(
    async (contactData: EditableContactFields) => {
      try {
        setIsSubmitting(true);

        if (contact?.id)
          await updateContact(contact.id, { ...contact, ...contactData });
        else await addContact(contactData);

        onClose();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Operação falhou';
        showAlert(errorMessage, 'error');
      } finally {
        setIsSubmitting(false);
      }
    },
    [contact, onClose, addContact, updateContact, showAlert],
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
