'use client';

import { FormEvent, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/auth/firebase';
import { useRouter } from 'next/navigation';
import {
  Button,
  Alert,
  CircularProgress,
  Divider,
  Typography,
  Link,
} from '@mui/material';
import { Card, CardContent } from '@mui/material';
import { colors } from '@mui/material';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmation) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(getAuth(app), email, password);
      router.push('/login');
    } catch (e) {
      setLoading(false);
      setError((e as Error).message);
    }
  }

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: '0 1px 3px 0 rgba(0,0,0,.2),0 1px 2px -1px rgba(0,0,0,.2)',
      }}
    >
      <CardContent sx={{ padding: 3, paddingTop: 0, minWidth: 400 }}>
        <div className="flex flex-col items-center justify-center p-6 pb-4">
          <h1 className="text-xl font-semibold tracking-tight">
            Crie sua conta
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Preencha as informações abaixo para registrar-se.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {error && <Alert severity="error">{error}</Alert>}
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
                style={{ WebkitBoxShadow: '0 0 0px 1000px #fff inset' }}
              />
            </div>
            <div>
              <label className="text-sm leading-none font-medium">Senha</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                placeholder="••••••••"
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-gray-500 focus:outline-0 focus:outline-gray-400 sm:text-sm"
                required
                style={{ WebkitBoxShadow: '0 0 0px 1000px #fff inset' }}
              />
            </div>
            <div>
              <label className="text-sm leading-none font-medium">
                Confirmar senha
              </label>
              <input
                type="password"
                name="confirm-password"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                id="confirm-password"
                placeholder="••••••••"
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-gray-500 focus:outline-0 focus:outline-gray-400 sm:text-sm"
                required
                style={{ WebkitBoxShadow: '0 0 0px 1000px #fff inset' }}
              />
            </div>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
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
              {loading ? 'Criando...' : 'Criar conta'}
            </Button>
            <Divider sx={{ paddingY: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Já tem uma conta?{' '}
                <Link
                  href="/login"
                  className="!decoration-inherit underline-offset-4"
                  color="#288d70"
                >
                  Faça login
                </Link>
              </Typography>
            </Divider>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
