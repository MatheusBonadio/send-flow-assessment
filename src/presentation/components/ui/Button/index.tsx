import { forwardRef } from 'react';
import { colors } from '@mui/material';

import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

interface IProps extends ButtonProps {
  loading?: boolean;
}

const CustomButton = forwardRef<HTMLButtonElement, IProps>(
  ({ loading, children, ...props }, ref) => {
    return (
      <Button
        {...props}
        ref={ref}
        disabled={loading || props.disabled}
        startIcon={
          loading ? (
            <CircularProgress size={16} style={{ color: colors.grey[600] }} />
          ) : (
            props.startIcon || null
          )
        }
        sx={{
          textTransform: 'initial',
          backgroundColor:
            props.variant == 'contained' && !props.color ? '#1b5444' : '',
          color: !props.variant ? colors.grey[800] : '',
        }}
      >
        {children}
      </Button>
    );
  },
);

CustomButton.displayName = 'CustomButton';

export default CustomButton;
