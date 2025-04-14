import React from 'react';
import { CircularProgress } from '@mui/material';

function Loading(): React.ReactNode {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress style={{ color: '#1b5444' }} />
    </div>
  );
}

export default Loading;
