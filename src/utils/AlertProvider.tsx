'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { SnackbarProvider, useSnackbar, VariantType } from 'notistack';

interface AlertContextType {
  showAlert: (message: string, variant?: VariantType) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const { enqueueSnackbar } = useSnackbar();

  const showAlert = (message: string, variant: VariantType = 'default') => {
    enqueueSnackbar(message, { variant });
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const SnackbarProviders = ({ children }: { children: ReactNode }) => (
  <SnackbarProvider
    maxSnack={5}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  >
    {children}
  </SnackbarProvider>
);
