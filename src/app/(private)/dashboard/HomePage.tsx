'use client';

import { useAuth } from '@/auth/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <main className="flex flex-col items-center justify-center p-24">
      <h1 className="mb-4 text-xl">Super secure home page</h1>
      <p className="mb-8">
        Only <strong>{user?.email}</strong> holds the magic key to this kingdom!
      </p>
    </main>
  );
}
