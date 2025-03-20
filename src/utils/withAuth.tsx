import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const withAuth = (WrappedComponent: React.ComponentType) => {
    const WithAuthComponent = (props: Record<string, unknown>) => {
        const [loading, setLoading] = useState(true);
        const [authenticated, setAuthenticated] = useState(false);
        const router = useRouter();
        const auth = getAuth();

        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    setAuthenticated(true);
                } else {
                    setAuthenticated(false);
                    router.push('/login');
                }
                setLoading(false);
            });

            return () => unsubscribe();
        }, [auth, router]);

        if (loading) return <div>Carregando...</div>;

        if (!authenticated) return null;

        return <WrappedComponent {...props} />;
    };

    WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
};

export default withAuth;
