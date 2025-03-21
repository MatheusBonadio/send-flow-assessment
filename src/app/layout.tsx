import './globals.css';
// import styles from './layout.module.css';
import {Metadata} from 'next';
import {getTokens} from 'next-firebase-auth-edge';
import {cookies, headers} from 'next/headers';
import {authConfig} from '@/config/serverConfig';
import {AuthProvider} from '../auth/AuthProvider';
import {toUser} from '@/shared/user';

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const tokens = await getTokens(await cookies(), {
    ...authConfig,
    headers: await headers()
  });
  const user = tokens ? toUser(tokens) : null;

  return (
    <html lang="en">
      <head />
      <body className={`antialiased`}>
            <AuthProvider user={user}>{children}</AuthProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: 'next-firebase-auth-edge example page',
  description: 'Next.js page showcasing next-firebase-auth-edge features',
  icons: '/favicon.ico'
};