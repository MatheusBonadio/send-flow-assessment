import { CustomButton, CustomModal } from '@/components/ui';
import { Delete } from '@mui/icons-material';

interface IProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export default function CustomDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirmar Exclusão',
  message = 'Você tem certeza de que deseja excluir este item?',
}: IProps) {
  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={title}
      actions={
        <>
          <CustomButton onClick={onClose} type="button">
            Cancelar
          </CustomButton>
          <CustomButton
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Excluir
          </CustomButton>
        </>
      }
    >
      {message}
    </CustomModal>
  );
}
