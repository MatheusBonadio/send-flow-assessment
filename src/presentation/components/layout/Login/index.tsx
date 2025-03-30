'use client';

import { FormEvent, useState } from 'react';
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { app } from '@/infrastructure/firebase/auth';
import {
  Card,
  Alert,
  CircularProgress,
  CardContent,
  Typography,
  Button,
  Link,
  Divider,
  colors,
} from '@mui/material';
import { GitHub, Google } from '@mui/icons-material';
import { useUsers } from '@/presentation/hooks/useUser';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { addUser } = useUsers();
  const router = useRouter();

  const auth = getAuth(app);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const idToken = await credential.user.getIdToken();

      await fetch('/api/login', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      router.push('/dashboard');
      router.refresh();
    } catch (e) {
      setLoading(false);
      setError((e as Error).message);
    }
  }

  async function handleGoogleLogin() {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const user = result.user;

      const isFirstLogin =
        user.metadata.creationTime === user.metadata.lastSignInTime;

      if (isFirstLogin)
        await addUser({ id: user.uid, email: user.email ?? '' });

      await fetch('/api/login', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      router.push('/dashboard');
      router.refresh();
    } catch (e) {
      setLoading(false);
      setError((e as Error).message);
    }
  }

  async function handleGithubLogin() {
    setError('');
    setLoading(true);

    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const user = result.user;

      const isFirstLogin =
        user.metadata.creationTime === user.metadata.lastSignInTime;

      if (isFirstLogin)
        await addUser({ id: user.uid, email: user.email ?? '' });

      await fetch('/api/login', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      router.push('/dashboard');
      router.refresh();
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
      <div className="flex">
        <CardContent sx={{ padding: 3, paddingTop: 0, minWidth: 400 }}>
          <div className="flex flex-col items-center justify-center p-6 pb-4">
            <h1 className="text-xl font-semibold tracking-tight">
              Bem-vindo de volta
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Entre com a sua conta do Google ou Github
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
              <div className="flex flex-col gap-2">
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Google />}
                  onClick={handleGoogleLogin}
                  sx={{
                    textTransform: 'initial',
                    color: colors.grey[800],
                    borderColor: colors.grey[600],
                    ':hover': { backgroundColor: colors.grey[100] },
                  }}
                >
                  <Typography fontSize={14} fontWeight={500}>
                    Entrar com Google
                  </Typography>
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<GitHub />}
                  onClick={handleGithubLogin}
                  sx={{
                    textTransform: 'initial',
                    color: colors.grey[800],
                    borderColor: colors.grey[600],
                    ':hover': { backgroundColor: colors.grey[100] },
                  }}
                >
                  <Typography fontSize={14} fontWeight={500}>
                    Entrar com Github
                  </Typography>
                </Button>
              </div>
              <Divider sx={{ paddingY: 0 }}>
                <Typography variant="body2" color="textSecondary">
                  ou continue com
                </Typography>
              </Divider>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {error && <Alert severity="error">{error}</Alert>}
                <div>
                  <label className="text-sm leading-none font-medium">
                    Email
                  </label>
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
                  <div className="flex items-center justify-between">
                    <label className="text-sm leading-none font-medium">
                      Senha
                    </label>
                    {/* <Link
                      href="#"
                      underline="hover"
                      className="!text-xs !text-gray-900"
                    >
                      Esqueceu sua senha?
                    </Link> */}
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-gray-500 focus:outline-0 focus:outline-gray-400 sm:text-sm"
                    required
                    style={{ WebkitBoxShadow: '0 0 0px 1000px #fff inset' }}
                  />
                </div>
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
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
              <Typography variant="body2" align="center">
                Não possui uma conta?{' '}
                <Link
                  href="/register"
                  className="!decoration-inherit underline-offset-4"
                  color="#288d70"
                >
                  Criar conta
                </Link>
              </Typography>
            </div>
          </form>
        </CardContent>
        <div
          className="hidden w-[300px] flex-grow items-center justify-center bg-cover bg-center opacity-70 md:flex"
          style={{
            backgroundImage: 'url(images/login-photo.webp)',
          }}
        />
      </div>
    </Card>
  );
}
