import React from 'react';
import './globals.css';
import { GeistSans } from 'geist/font/sans';
import { AuthProvider } from '@/presentation/providers/AuthProvider';
import { AlertProvider } from '@/presentation/providers/AlertProvider';
import { SnackbarProviders } from '@/presentation/providers/AlertProvider';
import { MenuProvider } from '@/presentation/contexts/MenuContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className={GeistSans.className}>
      <head />
      <body className="antialiased">
        <MenuProvider>
          <SnackbarProviders>
            <AlertProvider>
              <AuthProvider>{children}</AuthProvider>
            </AlertProvider>
          </SnackbarProviders>
        </MenuProvider>
      </body>
    </html>
  );
}
