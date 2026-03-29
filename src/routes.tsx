import { lazy, PropsWithChildren, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useAuth } from '@/app/apps/auth/useAuth';
import { Menu } from '@/app/apps/menu/MenuSide';
import { Loading } from '@/app/components/ui';

const LoginPage = lazy(() => import('@/app/apps/login/LoginPage'));
const RegisterPage = lazy(() => import('@/app/apps/register/RegisterPage'));
const ResetPasswordPage = lazy(() => import('@/app/apps/reset-password/ResetPasswordPage'));
const DashboardPage = lazy(() => import('@/app/apps/dashboard/DashboardPage'));
const ContactPage = lazy(() => import('@/app/apps/contacts/ContactsPage'));
const ConnectionPage = lazy(() => import('@/app/apps/connections/ConnectionsPage'));
const BroadcastPage = lazy(() => import('@/app/apps/broadcasts/BroadcastsPage'));
const MessagePage = lazy(() => import('@/app/apps/messages/MessagesPage'));

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
      <Suspense fallback={<Loading />}>
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
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPasswordPage />
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
      </Suspense>
    </Router>
  );
}
