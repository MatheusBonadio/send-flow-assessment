import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface ContactTableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const ContactTableActions: React.FC<ContactTableActionsProps> = ({
  onEdit,
  onDelete,
}) => (
  <div className="flex gap-2">
    <IconButton aria-label="edit" onClick={onEdit}>
      <EditIcon />
    </IconButton>
    <IconButton aria-label="delete" onClick={onDelete}>
      <DeleteIcon />
    </IconButton>
  </div>
);

export default ContactTableActions;
