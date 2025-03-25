import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface AddButtonProps {
  onClick: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      backgroundColor: '#007a55',
      color: 'white',
      '&:hover': { backgroundColor: '#164c3b' },
      padding: '.3rem',
      borderRadius: '.5rem',
    }}
  >
    <AddIcon style={{ fontSize: '18px' }} />
  </IconButton>
);

export default AddButton;
