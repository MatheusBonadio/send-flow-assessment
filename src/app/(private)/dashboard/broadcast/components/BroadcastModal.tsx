'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomModal, CustomButton, CustomInput } from '@/components/ui';
import { useAlert } from '@/utils/AlertProvider';
import {
  addBroadcast,
  IBroadcast,
  updateBroadcast,
} from '@/services/broadcastService';
import { Save } from '@mui/icons-material';
import { Autocomplete, Checkbox, TextField } from '@mui/material';
import { getAllContacts } from '@/services/contactService';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { getAllConnections } from '@/services/connectionService';

interface IProps {
  open: boolean;
  onClose: () => void;
  broadcast?: IBroadcast;
  refetch: () => void;
}

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'O nome é obrigatório'),
  status: z.enum(['scheduled', 'sent'], {
    errorMap: () => ({ message: 'O status é obrigatório' }),
  }),
  scheduledTime: z.string().min(1, 'O horário de agendamento é obrigatório'),
  messageBody: z.string().min(1, 'A mensagem é obrigatório'),
  connectionID: z.string().min(1, 'O ID de conexão é obrigatório'),
  contactsIDs: z.array(z.string()).min(1, 'Pelo menos um contato é necessário'),
});

type FormData = z.infer<typeof formSchema>;

export default function BroadcastModal({
  open,
  onClose,
  broadcast,
  refetch,
}: IProps) {
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<{ id: string; name: string }[]>([]);
  const [connections, setConnections] = useState<
    { id: string; name: string }[]
  >([]);
  const { showAlert } = useAlert();

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: broadcast?.id || '',
      name: broadcast?.name || '',
      status: broadcast?.status || 'scheduled',
      scheduledTime: broadcast?.scheduledTime || '',
      messageBody: broadcast?.messageBody || '',
      connectionID: broadcast?.connectionID || '',
      contactsIDs: broadcast?.contactsIDs || [],
    },
  });

  useEffect(() => {
    if (broadcast) {
      reset({
        id: broadcast.id,
        name: broadcast.name,
        status: broadcast.status,
        scheduledTime: broadcast.scheduledTime,
        messageBody: broadcast.messageBody,
        connectionID: broadcast.connectionID,
        contactsIDs: broadcast.contactsIDs,
      });
    } else {
      reset({
        id: '',
        name: '',
        status: 'scheduled',
        scheduledTime: '',
        messageBody: '',
        connectionID: '',
        contactsIDs: [],
      });
    }
  }, [broadcast, reset]);

  async function onSubmit(values: FormData) {
    setLoading(true);

    if (broadcast && broadcast.id)
      await handleUpdateBroadcast(broadcast.id, values);
    else await handleAddBroadcast(values);

    refetch();
    onClose();
    setLoading(false);
  }

  const handleAddBroadcast = async (newBroadcast: FormData) => {
    try {
      await addBroadcast(newBroadcast);
      showAlert('Transmissão agendada com sucesso!', 'success');
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    }
  };

  const handleUpdateBroadcast = async (
    id: string,
    updatedBroadcast: FormData,
  ) => {
    try {
      await updateBroadcast(id, updatedBroadcast);
      showAlert('Transmissão atualizada com sucesso!', 'success');
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    }
  };

  useEffect(() => {
    async function fetchContacts() {
      try {
        const fetchedContacts = await getAllContacts();
        setContacts(fetchedContacts);
      } catch (error: unknown) {
        showAlert(String(error), 'error');
      }
    }
    fetchContacts();

    async function fetchConnections() {
      try {
        const fetchedConnections = await getAllConnections();
        setConnections(fetchedConnections);
      } catch (error: unknown) {
        showAlert(String(error), 'error');
      }
    }

    fetchConnections();
  }, [showAlert]);

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={broadcast ? 'Editar Transmissão' : 'Nova Transmissão'}
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

        <Controller
          name="contactsIDs"
          control={control}
          render={({ field }) => {
            const selectedIds = field.value || [];
            return (
              <Autocomplete
                multiple
                options={contacts}
                getOptionLabel={(option) => option.name}
                disableCloseOnSelect
                renderOption={(props, option, { selected }) => {
                  const { key, ...restProps } = props;
                  return (
                    <li key={key} {...restProps}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{
                          marginRight: 8,
                          color: selected ? '#000' : '#8c8c8c',
                        }}
                        checked={selected}
                      />
                      {option.name}
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Contatos"
                    error={!!errors.contactsIDs}
                    helperText={errors.contactsIDs?.message}
                    color="..."
                  />
                )}
                onChange={(_, value) => {
                  const selectedValues = value.map((item) => item.id);
                  field.onChange(selectedValues);
                }}
                value={contacts.filter((contact) =>
                  selectedIds.includes(contact.id),
                )}
              />
            );
          }}
        />

        <Controller
          name="connectionID"
          control={control}
          render={({ field }) => (
            <Autocomplete
              options={connections}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Conexão"
                  error={!!errors.connectionID}
                  helperText={errors.connectionID?.message}
                />
              )}
              onChange={(_, value) => field.onChange(value?.id || '')}
              value={
                connections.find(
                  (connection) => connection.id === field.value,
                ) || null
              }
            />
          )}
        />

        <TextField
          className="w-full"
          label="Mensagem"
          error={!!errors.messageBody}
          helperText={errors.messageBody?.message}
          multiline
          rows={3}
          color="..."
          {...register('messageBody')}
        />

        <CustomInput
          className="w-full"
          type="datetime-local"
          label="Horário Agendado"
          focused
          error={!!errors.scheduledTime}
          helperText={errors.scheduledTime?.message}
          {...register('scheduledTime')}
        />
      </form>
    </CustomModal>
  );
}
