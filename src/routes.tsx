import { PropsWithChildren } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from '@/app/(public)/login/page';
import RegisterPage from '@/app/(public)/register/page';
import DashboardPage from '@/app/(private)/dashboard/page';
import ContactPage from '@/app/(private)/dashboard/contacts/ContactsPage';
import ConnectionPage from '@/app/(private)/dashboard/connections/ConnectionsPage';
import BroadcastPage from '@/app/(private)/dashboard/broadcast/BroadcastsPage';
import MessagePage from '@/app/(private)/dashboard/messages/MessagesPage';
import { useAuth } from '@/presentation/hooks/useAuth';
import { Menu } from '@/presentation/components/layout/Menu';
import { Loading } from '@/presentation/components/ui';

interface RouteProps extends PropsWithChildren {}

function PrivateRoute(props: RouteProps): React.ReactNode {
  const { children } = props;
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  return user ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute(props: RouteProps): React.ReactNode {
  const { children } = props;
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  return user ? <Navigate to="/dashboard" /> : <>{children}</>;
}

export default function AppRoutes(): React.ReactNode {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Menu />
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/contacts"
          element={
            <PrivateRoute>
              <Menu />
              <ContactPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/connections"
          element={
            <PrivateRoute>
              <Menu />
              <ConnectionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/broadcast"
          element={
            <PrivateRoute>
              <Menu />
              <BroadcastPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/messages"
          element={
            <PrivateRoute>
              <Menu />
              <MessagePage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
