import { getTokens } from 'next-firebase-auth-edge';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { authConfig } from '@/config/serverConfig';
import HomePage from './HomePage';

export default async function Home() {
  const cookieStore = await cookies();

  const tokens = await getTokens(cookieStore, authConfig);

  if (!tokens) {
    notFound();
  }

  return <HomePage email={tokens?.decodedToken.email} />;
}
