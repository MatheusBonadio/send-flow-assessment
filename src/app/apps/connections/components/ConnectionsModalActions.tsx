import { CustomButton } from '@/app/components/ui';
import { Save } from '@mui/icons-material';

interface ConnectionModalActionsProps {
  onClose: () => void;
  loading: boolean;
}

export function ConnectionModalActions(
  props: ConnectionModalActionsProps,
): React.ReactNode {
  const { onClose, loading } = props;

  return (
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
}
