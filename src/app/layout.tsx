import './globals.css';
import { Metadata } from 'next';
import { getTokens } from 'next-firebase-auth-edge';
import { cookies, headers } from 'next/headers';
import { authConfig } from '@/config/serverConfig';
import { AuthProvider } from '../auth/AuthProvider';
import { toUser } from '@/shared/user';
import { AlertProvider } from '@/components/layout/Alert/AlertProvider';
import { SnackbarProviders } from '@/components/layout/Alert/AlertProvider';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tokens = await getTokens(await cookies(), {
    ...authConfig,
    headers: await headers(),
  });
  const user = tokens ? toUser(tokens) : null;

  return (
    <html lang="en">
      <head />
      <body className={`antialiased`}>
        <SnackbarProviders>
          <AlertProvider>
            <AuthProvider user={user}>{children}</AuthProvider>
          </AlertProvider>
        </SnackbarProviders>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: 'UnniChat',
};
