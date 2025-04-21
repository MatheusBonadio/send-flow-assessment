import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomInput } from '@/app/components/ui';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'O nome da conexão é obrigatório'),
});

type FormData = z.infer<typeof formSchema>;

interface ConnectionFormProps {
  onSubmit: (values: FormData) => void;
  defaultValues?: FormData;
}

export function ConnectionForm(props: ConnectionFormProps): React.ReactNode {
  const { onSubmit, defaultValues } = props;

  const {
    handleSubmit,
    register,
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
        label="Nome da Conexão"
        error={!!errors.name}
        helperText={errors.name?.message}
        {...register('name')}
      />
    </form>
  );
}
