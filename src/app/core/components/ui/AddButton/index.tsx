import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface AddButtonProps {
  onClick: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ onClick }) => (
  <Button
    onClick={onClick}
    variant="contained"
    startIcon={<AddIcon />}
    sx={{
      borderRadius: '1rem',
      backgroundColor: '#007a55',
      '&:hover': {
        backgroundColor: '#164c3b',
      },
      textTransform: 'none',
    }}
  >
    Adicionar
  </Button>
);

export default AddButton;
