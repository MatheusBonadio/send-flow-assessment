'use client';

import CustomMenuItem from '@/presentation/components/ui/MenuItem';
import {
  ContactsOutlined,
  DashboardOutlined,
  Logout,
  MessageOutlined,
  Podcasts,
  WhatsApp,
} from '@mui/icons-material';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/infrastructure/firebase/auth';
import { Avatar, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { useState } from 'react';
import Link from 'next/link';

export function Menu() {
  const { user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    await signOut(getAuth(app));

    await fetch('/api/logout');

    window.location.href = '/login';
  }

  return (
    <menu
      className="fixed top-0 z-100 flex h-screen w-[255px] flex-col px-2 py-5"
      style={{
        backgroundColor: '#fafafa',
      }}
    >
      <Link href="/" className="px-4">
        <span className="text-xl font-bold">UnniChat</span>
      </Link>
      <div className="flex flex-col gap-1 p-2">
        <div className="px-2 pt-1 text-xs font-medium opacity-70">Funções</div>
        <CustomMenuItem
          href="/dashboard"
          icon={
            <DashboardOutlined
              style={{ fontSize: '16px', position: 'relative', top: -1 }}
            />
          }
        >
          Dashboard
        </CustomMenuItem>
        <CustomMenuItem
          href="/dashboard/contacts"
          icon={
            <ContactsOutlined
              style={{ fontSize: '16px', position: 'relative', top: -1 }}
            />
          }
        >
          Contatos
        </CustomMenuItem>
        <CustomMenuItem
          href="/dashboard/connections"
          icon={
            <WhatsApp
              style={{ fontSize: '16px', position: 'relative', top: -1 }}
            />
          }
        >
          Conexões
        </CustomMenuItem>
        <CustomMenuItem
          href="/dashboard/broadcast"
          icon={
            <Podcasts
              style={{ fontSize: '16px', position: 'relative', top: -1 }}
            />
          }
        >
          Transmissões
        </CustomMenuItem>
        <CustomMenuItem
          href="/dashboard/messages"
          icon={
            <MessageOutlined
              style={{ fontSize: '16px', position: 'relative', top: -1 }}
            />
          }
        >
          Mensagens
        </CustomMenuItem>
      </div>
      <div className="flex flex-col gap-1 p-2">
        <div className="px-2 pt-1 text-xs font-medium opacity-70">Perfil</div>
        <div className="flex items-center gap-2 p-2 text-sm">
          <Avatar
            alt="Profile"
            src={user?.photoURL || ''}
            sx={{ width: 32, height: 32, borderRadius: '8px' }}
            variant="square"
          />
          <div className="flex flex-col overflow-hidden">
            <span className="overflow-hidden font-medium text-ellipsis whitespace-nowrap">
              {user?.displayName || 'Bem vindo'}
            </span>
            <div className="overflow-hidden text-xs text-ellipsis whitespace-nowrap">
              <span>
                <Tooltip title={user?.email || ''}>
                  <span>{user?.email}</span>
                </Tooltip>
              </span>
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <IconButton
              onClick={handleLogout}
              size="small"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <CircularProgress size={16} style={{ color: '#1b5444' }} />
              ) : (
                <Logout
                  style={{ fontSize: '16px', position: 'relative', top: -1 }}
                />
              )}
            </IconButton>
          </div>
        </div>
      </div>
    </menu>
  );
}
