import React, { forwardRef } from 'react';

import TextField, { TextFieldProps } from '@mui/material/TextField';

const CustomInput = forwardRef<HTMLInputElement, TextFieldProps>(
  (props, ref) => {
    return <TextField {...props} inputRef={ref} /* color="..." */ />;
  },
);

CustomInput.displayName = 'CustomInput';
export default CustomInput;
