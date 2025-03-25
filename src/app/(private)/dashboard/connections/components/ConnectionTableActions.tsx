import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface ConnectionTableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const ConnectionTableActions: React.FC<ConnectionTableActionsProps> = ({
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

export default ConnectionTableActions;
