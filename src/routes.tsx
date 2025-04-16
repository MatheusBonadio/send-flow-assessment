import { PropsWithChildren } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from '@/app/apps/login/LoginPage';
import RegisterPage from '@/app/apps/register/RegisterPage';
import DashboardPage from '@/app/apps/dashboard/DashboardPage';
import ContactPage from '@/app/apps/contacts/ContactsPage';
import ConnectionPage from '@/app/apps/connections/ConnectionsPage';
import BroadcastPage from '@/app/apps/broadcasts/BroadcastsPage';
import MessagePage from '@/app/apps/messages/MessagesPage';
import { useAuth } from '@/app/apps/auth/useAuth';
import { Menu } from '@/app/apps/menu/MenuSide';
import { Loading } from '@/app/components/ui';

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
