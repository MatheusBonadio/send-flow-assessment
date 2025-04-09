import { CustomButton } from '@/presentation/components/ui';
import { Save } from '@mui/icons-material';

interface ConnectionModalActionsProps {
  onClose: () => void;
  loading: boolean;
}

export const ConnectionModalActions: React.FC<ConnectionModalActionsProps> = ({
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
