'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CustomModal,
  CustomButton,
  CustomInput,
} from '@/presentation/components/ui';
import { useAlert } from '@/presentation/providers/AlertProvider';
import {
  addConnection,
  IConnection,
  updateConnection,
} from '@/services/connectionService';
import { Save } from '@mui/icons-material';

interface IProps {
  open: boolean;
  onClose: () => void;
  connection?: IConnection;
}

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'O nome é obrigatório'),
});

type FormData = z.infer<typeof formSchema>;

export default function ConnectionModal({ open, onClose, connection }: IProps) {
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
      id: connection?.id || '',
      name: connection?.name || '',
    },
  });

  useEffect(() => {
    if (connection) {
      reset({
        id: connection.id,
        name: connection.name,
      });
    } else {
      reset({
        id: '',
        name: '',
      });
    }
  }, [connection, reset]);

  async function onSubmit(values: FormData) {
    setLoading(true);

    if (connection && connection.id)
      await handleUpdateConnection(connection.id, values);
    else await handleAddConnection(values);

    onClose();
    setLoading(false);
  }

  const handleAddConnection = async (newConnection: FormData) => {
    try {
      await addConnection(newConnection);
      showAlert('Conexão adicionada com sucesso!', 'success');
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    }
  };

  const handleUpdateConnection = async (
    id: string,
    updatedConnection: FormData,
  ) => {
    try {
      await updateConnection(id, updatedConnection);
      showAlert('Conexão atualizada com sucesso!', 'success');
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    }
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={connection ? 'Editar Conexão' : 'Nova Conexão'}
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
      </form>
    </CustomModal>
  );
}
