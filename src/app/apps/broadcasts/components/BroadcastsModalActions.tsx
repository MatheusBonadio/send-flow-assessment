import { CustomButton } from '@/app/core/components/ui';
import { Save } from '@mui/icons-material';

interface BroadcastModalActionsProps {
  onClose: () => void;
  loading: boolean;
}

export const BroadcastModalActions: React.FC<BroadcastModalActionsProps> = ({
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
