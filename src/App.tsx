import AuthProvider from '@/app/apps/auth/AuthProvider';
import { AlertProvider } from '@/app/apps/alert/AlertProvider';
import { SnackbarProviders } from '@/app/apps/alert/AlertProvider';
import { MenuProvider } from '@/app/apps/menu/MenuContext';
import AppRoutes from './routes';

function App() {
  return (
    <AuthProvider>
      <MenuProvider>
        <SnackbarProviders>
          <AlertProvider>
            <AppRoutes />
          </AlertProvider>
        </SnackbarProviders>
      </MenuProvider>
    </AuthProvider>
  );
}

export default App;
