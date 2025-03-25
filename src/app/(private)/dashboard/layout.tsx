import { Metadata } from 'next';
import { Menu } from '@/presentation/components/layout/Menu';
import { Body } from '@/presentation/components/layout/Body';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Menu />
      <Body>{children}</Body>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'UnniChat Dashboard',
};
