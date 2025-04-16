import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface BroadcastTableActionsProps {
  onDelete: () => void;
}

const BroadcastTableActions: React.FC<BroadcastTableActionsProps> = ({
  onDelete,
}) => (
  <div className="flex gap-2">
    <IconButton aria-label="delete" onClick={onDelete}>
      <DeleteIcon />
    </IconButton>
  </div>
);

export default BroadcastTableActions;
