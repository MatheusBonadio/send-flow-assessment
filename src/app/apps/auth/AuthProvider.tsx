import { type User, onAuthStateChanged, signOut } from 'firebase/auth';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '@/app/apps/auth/AuthContext';
import { auth } from '@/app/core/lib/firebase';

interface Datas {
  user: User | null;
  loading: boolean;
}

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const [datas, setDatas] = useState<Datas>({
    user: null,
    loading: true,
  });

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setDatas({
        user,
        loading: false,
      });
    });

    return () => unsubscribe();
  }, []);

  const context = useMemo(() => {
    return {
      user: datas.user,
      loading: datas.loading,
      logout,
    };
  }, [datas.user, datas.loading, logout]);

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
}
