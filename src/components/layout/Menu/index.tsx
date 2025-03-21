'use client';

import CustomMenuItem from '@/components/ui/MenuItem';
import {
  ContactsOutlined,
  DashboardOutlined,
  Logout,
  Podcasts,
  WhatsApp,
} from '@mui/icons-material';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/auth/firebase';
import { Avatar, IconButton } from '@mui/material';
import { useAuth } from '@/auth/AuthContext';

export function Menu() {
  const { user } = useAuth();

  async function handleLogout() {
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
      <div className="px-2">
        <CustomMenuItem href="/">
          <span className="text-xl font-bold">UnniChat</span>
        </CustomMenuItem>
      </div>
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
          Broadcasts
        </CustomMenuItem>
      </div>
      <div className="flex flex-col gap-1 p-2">
        <div className="px-2 pt-1 text-xs font-medium opacity-70">
          Credenciais
        </div>
        <div className="flex items-center gap-2 p-2 text-sm">
          <Avatar
            alt="Profile"
            src={user?.photoURL || undefined}
            sx={{ width: 32, height: 32, borderRadius: '8px' }}
            variant="square"
          />
          <div className="flex flex-col overflow-hidden">
            <span className="overflow-hidden font-medium text-ellipsis whitespace-nowrap">
              {user?.displayName || 'John Doe'}
            </span>
            <div className="overflow-hidden text-xs text-ellipsis whitespace-nowrap">
              {user?.email}
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <IconButton onClick={handleLogout} size="small">
              <Logout
                style={{ fontSize: '16px', position: 'relative', top: -1 }}
              />
            </IconButton>
          </div>
        </div>
      </div>
    </menu>
  );
}
