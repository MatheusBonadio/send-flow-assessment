import Link from 'next/link';
import { Metadata } from 'next';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Link href="/dashboard/connections">Conexões</Link>
      <br />
      <Link href="/dashboard/contacts">Contatos</Link>
      <br />
      <Link href="/dashboard/broadcast">Broadcasts</Link>
      {children}
    </div>
  );
}

export const metadata: Metadata = {
  title: 'UnniChat Dashboard',
};
