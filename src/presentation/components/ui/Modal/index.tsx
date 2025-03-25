import React, { ReactNode } from 'react';
import {
  Dialog,
  DialogProps,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

interface IProps extends DialogProps {
  children: ReactNode;
  title?: string;
  onClose?: () => void;
  actions?: ReactNode;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root': {
    borderRadius: 8,
  },
}));

export default function CustomModal({
  children,
  title,
  onClose,
  actions,
  ...rest
}: IProps) {
  return (
    <BootstrapDialog {...rest} fullWidth={true} maxWidth="sm">
      {title && (
        <DialogTitle sx={{ fontWeight: '600' }}>
          {title}
          {onClose && (
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={(theme) => ({
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              })}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}
      <DialogContent dividers sx={{ paddingX: '1.5rem!important' }}>
        {children}
      </DialogContent>
      <DialogActions sx={{ padding: '1rem!important' }}>
        {actions}
      </DialogActions>
    </BootstrapDialog>
  );
}
