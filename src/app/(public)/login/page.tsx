import { Typography, Link } from '@mui/material';
import Login from '@/presentation/components/layout/Login';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="mb-4 flex items-center justify-center select-none">
        <div
          className="justify-centers flex h-6 w-6 items-center rounded-lg"
          style={{ backgroundColor: '#66c0a6' }}
        >
          <img
            src="images/unnichat-logo.png"
            alt="Unnichat Logo"
            className="ml-1 w-4"
          />
        </div>
        <span className="ml-2 text-lg font-semibold tracking-tight">
          UnniChat
        </span>
      </div>
      <Login />
      <Typography
        variant="caption"
        align="center"
        display="block"
        style={{ marginTop: '16px' }}
      >
        Ao clicar em entrar, você concorda com nossos <br />
        <Link href="#" underline="hover" sx={{ color: '#288d70' }}>
          Termos de Serviço
        </Link>{' '}
        e{' '}
        <Link href="#" underline="hover" sx={{ color: '#288d70' }}>
          Política de Privacidade
        </Link>
        .
      </Typography>
    </div>
  );
}
