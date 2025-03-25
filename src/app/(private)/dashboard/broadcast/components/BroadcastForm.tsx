import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, Checkbox, TextField } from '@mui/material';
import { CustomInput } from '@/presentation/components/ui';
import { Contact } from '@/core/entities/contact';
import { Connection } from '@/core/entities/connection';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'O nome é obrigatório'),
  scheduledAt: z.coerce.date().refine((date) => date > new Date(), {
    message: 'O horário de agendamento deve ser no futuro',
  }),
  body: z.string().min(1, 'A mensagem é obrigatória'),
  connectionID: z.string().min(1, 'O ID de conexão é obrigatório'),
  connectionName: z.string().optional(),
  contactsIDs: z.array(z.string()).min(1, 'Pelo menos um contato é necessário'),
});

type FormData = z.infer<typeof formSchema>;

interface BroadcastFormProps {
  onSubmit: (values: FormData) => void;
  loading?: boolean;
  defaultValues?: FormData;
  contacts: Omit<Contact, 'phone'>[];
  connections: Connection[];
}

export const BroadcastForm: React.FC<BroadcastFormProps> = ({
  onSubmit,
  defaultValues,
  contacts,
  connections,
}) => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
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
        render={({ field }) => (
          <Autocomplete
            multiple
            options={contacts}
            getOptionLabel={(option) => option.name}
            disableCloseOnSelect
            renderOption={(props, option, { selected }) => {
              const { key, ...restProps } = props;
              return (
                <li key={key} {...restProps}>
                  <Checkbox checked={selected} />
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
              />
            )}
            onChange={(_, value) =>
              field.onChange(value.map((item) => item.id))
            }
            value={contacts.filter((contact) =>
              field.value?.includes(contact.id),
            )}
          />
        )}
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
            value={connections.find((conn) => conn.id === field.value) || null}
          />
        )}
      />

      <TextField
        className="w-full"
        label="Mensagem"
        error={!!errors.body}
        helperText={errors.body?.message}
        multiline
        rows={3}
        {...register('body')}
      />

      <CustomInput
        className="w-full"
        type="datetime-local"
        label="Agendado para"
        error={!!errors.scheduledAt}
        helperText={errors.scheduledAt?.message}
        {...register('scheduledAt')}
        focused
      />
    </form>
  );
};
