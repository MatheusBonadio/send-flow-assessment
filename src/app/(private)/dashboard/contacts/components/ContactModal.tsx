'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomModal, CustomButton, CustomInput } from '@/components/ui';
import { useAlert } from '@/utils/AlertProvider';
import { addContact, IContact, updateContact } from '@/services/contactService';
import { Save } from '@mui/icons-material';

interface IProps {
  open: boolean;
  onClose: () => void;
  contact?: IContact;
}

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'O nome é obrigatório'),
  phone: z.string().min(1, 'O telefone é obrigatório'),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactModal({ open, onClose, contact }: IProps) {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: contact?.id || '',
      name: contact?.name || '',
      phone: contact?.phone || '',
    },
  });

  useEffect(() => {
    if (contact) {
      reset({
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
      });
    } else {
      reset({
        id: '',
        name: '',
        phone: '',
      });
    }
  }, [contact, reset]);

  async function onSubmit(values: FormData) {
    setLoading(true);

    if (contact && contact.id) await handleUpdateContact(contact.id, values);
    else await handleAddContact(values);

    onClose();
    setLoading(false);
  }

  const handleAddContact = async (newContact: FormData) => {
    try {
      await addContact(newContact);
      showAlert('Contato adicionado com sucesso!', 'success');
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    }
  };

  const handleUpdateContact = async (id: string, updatedContact: FormData) => {
    try {
      await updateContact(id, updatedContact);
      showAlert('Contato atualizado com sucesso!', 'success');
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    }
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={contact ? 'Editar Contato' : 'Novo Contato'}
      actions={
        <>
          <CustomButton onClick={onClose} type="button" disabled={loading}>
            Cancelar
          </CustomButton>
          <CustomButton
            variant="contained"
            loading={loading}
            startIcon={<Save />}
            onClick={() =>
              document
                .querySelector('form')
                ?.dispatchEvent(
                  new Event('submit', { cancelable: true, bubbles: true }),
                )
            }
          >
            Salvar
          </CustomButton>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <CustomInput
          className="w-full"
          type="text"
          label="Nome"
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register('name')}
        />

        <CustomInput
          className="w-full"
          type="text"
          label="Telefone"
          error={!!errors.phone}
          helperText={errors.phone?.message}
          {...register('phone')}
        />
      </form>
    </CustomModal>
  );
}
