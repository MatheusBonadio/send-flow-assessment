import AuthProvider from '@/presentation/providers/AuthProvider';
import { AlertProvider } from '@/presentation/providers/AlertProvider';
import { SnackbarProviders } from '@/presentation/providers/AlertProvider';
import { MenuProvider } from '@/presentation/contexts/MenuContext';
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
