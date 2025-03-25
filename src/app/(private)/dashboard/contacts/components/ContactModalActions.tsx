import { CustomButton } from '@/presentation/components/ui';
import { Save } from '@mui/icons-material';

interface ContactModalActionsProps {
  onClose: () => void;
  loading: boolean;
}

export const ContactModalActions: React.FC<ContactModalActionsProps> = ({
  onClose,
  loading,
}) => (
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
);
