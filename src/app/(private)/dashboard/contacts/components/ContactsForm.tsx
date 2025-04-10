import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomInput } from '@/presentation/components/ui';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'O nome é obrigatório'),
  phone: z.string().min(1, 'O telefone é obrigatório'),
});

type FormData = z.infer<typeof formSchema>;

interface ContactFormProps {
  onSubmit: (values: FormData) => void;
  defaultValues?: FormData;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  defaultValues,
}) => {
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
  );
};
