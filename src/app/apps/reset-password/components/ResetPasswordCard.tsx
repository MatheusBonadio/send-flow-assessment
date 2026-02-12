import { FormEvent, useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/app/core/lib/firebase';
import {
  Card,
  Alert,
  CircularProgress,
  CardContent,
  Typography,
  Button,
  Link,
  colors,
} from '@mui/material';

export default function ResetPasswordCard() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (e) {
      const message = (e as Error).message;

      if (message.includes('user-not-found')) {
        setError('Nenhuma conta encontrada com este e-mail.');
      } else if (message.includes('invalid-email')) {
        setError('E-mail inválido. Verifique e tente novamente.');
      } else if (message.includes('too-many-requests')) {
        setError('Muitas tentativas. Tente novamente mais tarde.');
      } else {
        setError('Ocorreu um erro ao enviar o e-mail. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: '0 1px 3px 0 rgba(0,0,0,.2),0 1px 2px -1px rgba(0,0,0,.2)',
      }}
    >
      <CardContent sx={{ padding: 3, minWidth: 400 }}>
        <div className="flex flex-col items-center justify-center p-6 pb-4">
          <h1 className="text-xl font-semibold tracking-tight">
            Redefinir senha
          </h1>
          <p className="mt-1 text-center text-sm text-gray-600">
            Informe seu e-mail e enviaremos um link para redefinir sua senha
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 md:space-y-6"
          action="#"
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {error && <Alert severity="error">{error}</Alert>}
            {success && (
              <Alert severity="success">
                E-mail enviado com sucesso! Verifique sua caixa de entrada e
                siga as instruções para redefinir sua senha.
              </Alert>
            )}
            <div>
              <label className="text-sm leading-none font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-gray-500 focus:outline-0 focus:outline-gray-400 sm:text-sm"
                placeholder="nome@email.com"
                required
                disabled={success}
                style={{ WebkitBoxShadow: '0 0 0px 1000px #fff inset' }}
              />
            </div>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || success}
              startIcon={
                loading ? (
                  <CircularProgress
                    size={16}
                    style={{ color: colors.grey[600] }}
                  />
                ) : null
              }
              sx={{
                textTransform: 'initial',
                fontWeight: 500,
                backgroundColor: '#1b5444',
                color: '#fff',
              }}
            >
              {loading ? 'Enviando...' : 'Enviar link de redefinição'}
            </Button>
            <Typography variant="body2" align="center">
              Lembrou sua senha?{' '}
              <Link
                href="/login"
                className="!decoration-inherit underline-offset-4"
                color="#288d70"
              >
                Voltar para login
              </Link>
            </Typography>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
