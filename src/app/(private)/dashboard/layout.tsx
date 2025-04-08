import { Menu } from '@/presentation/components/layout/Menu';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Menu />
      {children}
    </div>
  );
}
