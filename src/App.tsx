import AuthProvider from '@/presentation/providers/AuthProvider';
import { AlertProvider } from '@/presentation/providers/AlertProvider';
import { SnackbarProviders } from '@/presentation/providers/AlertProvider';
import { MenuProvider } from '@/presentation/contexts/MenuContext';
import AppRoutes from './routes';

function App() {
  return (
    <MenuProvider>
      <SnackbarProviders>
        <AlertProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </AlertProvider>
      </SnackbarProviders>
    </MenuProvider>
  );
}

export default App;
