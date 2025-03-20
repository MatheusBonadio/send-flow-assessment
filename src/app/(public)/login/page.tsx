"use client";

import { FormEvent, useState } from "react";
// import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "@/lib/firebase";
import { Card, CircularProgress, CardContent, Typography, Button, Link, Divider, colors } from '@mui/material';
import { Google } from '@mui/icons-material';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(
        getAuth(app),
        email,
        password
      );
      const idToken = await credential.user.getIdToken();

      await fetch("/api/login", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      router.push("/dashboard");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="mb-4 flex items-center justify-center">
        <div className="flex justify-centers items-center w-6 h-6 rounded-lg" style={{ backgroundColor: '#66c0a6' }}>
          <img
            src="unnichat-logo.png"
            alt="Unnichat Logo"
            className="w-4 ml-1"
          />
        </div>
        <span className="font-semibold tracking-tight text-lg ml-2">
          Unnichat
        </span>
      </div>
      <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px 0 rgba(0,0,0,.2),0 1px 2px -1px rgba(0,0,0,.2)' }}>
        <div className="flex">
        <CardContent sx={{ padding: 3, paddingTop: 0, minWidth: 400 }}>
        <div className="flex items-center flex-col justify-center p-6 pb-4">
          <h1 className="font-semibold tracking-tight text-xl">Bem-vindo de volta</h1>
          <p className="text-sm text-gray-600 mt-1">Entre com a sua conta do Google</p>
        </div>
        <form
            onSubmit={handleSubmit}
            className="space-y-4 md:space-y-6"
            action="#"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Button variant="outlined" fullWidth startIcon={<Google />} sx={{ textTransform: 'initial', color: colors.grey[800], borderColor: colors.grey[600], ":hover": { backgroundColor: colors.grey[100] } }}>
                  Entrar com Google
                </Button>
              <Divider sx={{ paddingY: 0 }}>
                <Typography variant="body2" color="textSecondary">
                  Ou continue com
                </Typography>
              </Divider>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="text-sm font-medium leading-none">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    className="bg-gray-50 border mt-1 border-gray-300 text-gray-900  sm:text-sm rounded-lg focus:outline-0 focus:border-gray-500 focus:outline-gray-400 block w-full p-2.5"
                    placeholder="nome@email.com"
                    required
                    style={{ WebkitBoxShadow: '0 0 0px 1000px #fff inset' }}
                    />
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium leading-none">Senha</label>
                    <Link href="#" underline="hover" className="!text-xs !text-gray-900">
                      Esqueceu sua senha?
                    </Link>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    className="bg-gray-50 border mt-1 border-gray-300 text-gray-900  sm:text-sm rounded-lg focus:outline-0 focus:border-gray-500 focus:outline-gray-400 block w-full p-2.5"
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
                startIcon={loading ? <CircularProgress size={16} style={{'color': colors.grey[600] }}/> : null}
                sx={{ textTransform: 'initial', fontWeight: 500, backgroundColor: '#1b5444', color: '#fff' }}
                >
                {loading ? "Entrando..." : "Entrar"}
                </Button>
              <Typography variant="body2" align="center">
                Não possui uma conta?{' '}
                <Link href="/register" className="underline-offset-4 !decoration-inherit" color="#288d70">
                  Registrar
                </Link>
              </Typography>
            </div>
          </form>
        </CardContent>
        <div
            className="hidden md:flex items-center justify-center bg-cover bg-center w-[300px] flex-grow opacity-50"
            style={{
              backgroundImage: 'url(login-photo.webp)',
            }}
          />
        </div>
      </Card>

      <Typography variant="caption" align="center" display="block" style={{ marginTop: '16px' }}>
        Ao clicar em entrar, você concorda com nossos{' '}
        <br />
        <Link href="#" underline="hover" color="#288d70">
          Termos de Serviço
        </Link>{' '}
        e de{' '}
        <Link href="#" underline="hover" color="#288d70">
          Política de Privacidade
        </Link>
        .
      </Typography>
    </div>
  );
}