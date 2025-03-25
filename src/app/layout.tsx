import './globals.css';
import { Metadata } from 'next';
import { getTokens } from 'next-firebase-auth-edge';
import { cookies, headers } from 'next/headers';
import { authConfig } from '@/infrastructure/config/serverConfig';
import { AuthProvider } from '@/presentation/providers/AuthProvider';
import { toUser } from '@/shared/user';
import { AlertProvider } from '@/presentation/providers/AlertProvider';
import { SnackbarProviders } from '@/presentation/providers/AlertProvider';
import { GeistSans } from 'geist/font/sans';

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
    <html lang="pt-br" className={GeistSans.className}>
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
