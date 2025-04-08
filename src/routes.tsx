import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from '@/app/(public)/login/page';
import RegisterPage from '@/app/(public)/register/page';
import DashboardPage from '@/app/(private)/dashboard/page';
import ContactPage from '@/app/(private)/dashboard/contacts/page';
import ConnectionPage from '@/app/(private)/dashboard/connections/page';
import BroadcastPage from '@/app/(private)/dashboard/broadcast/page';
import MessagePage from '@/app/(private)/dashboard/messages/page';
import { useAuth } from '@/presentation/hooks/useAuth';
import { CircularProgress } from '@mui/material';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/contacts"
          element={
            <PrivateRoute>
              <ContactPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/connections"
          element={
            <PrivateRoute>
              <ConnectionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/broadcast"
          element={
            <PrivateRoute>
              <BroadcastPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/messages"
          element={
            <PrivateRoute>
              <MessagePage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
