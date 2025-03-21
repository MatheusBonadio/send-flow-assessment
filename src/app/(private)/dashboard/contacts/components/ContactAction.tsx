import React from 'react';
import { Button } from '@mui/material';

interface ContactActionsProps {
  onAdd: () => void;
  onUpdate: (id: string, updatedData: { name: string; phone: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const ContactActions: React.FC<ContactActionsProps> = ({ onAdd, onUpdate, onDelete }) => {
  return (
    <div>
      <Button variant="contained" color="primary" onClick={onAdd}>
        Adicionar Contato
      </Button>
    </div>
  );
};

export default ContactActions;
