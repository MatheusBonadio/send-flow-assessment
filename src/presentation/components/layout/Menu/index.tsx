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
import { app } from '@/lib/firebase';
import { Avatar, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useState } from 'react';
import { useMenu } from '@/presentation/contexts/MenuContext';
import { Link, useNavigate } from 'react-router-dom';

const MenuTitle = ({ isMenuOpen }: { isMenuOpen: boolean }) => (
  <Link to="/" className={`${isMenuOpen ? 'px-4' : 'px-2'}`}>
    <span
      className={`text-${isMenuOpen ? 'xl' : 'xs'} font-bold`}
      style={{ transition: 'font-size 0.3s' }}
    >
      {isMenuOpen ? 'UnniChat' : 'Unni'}
    </span>
  </Link>
);

const MenuSectionTitle = ({
  isMenuOpen,
  title,
}: {
  isMenuOpen: boolean;
  title: string;
}) => (
  <div
    className={`px-2 pt-1 text-xs font-medium opacity-70 ${isMenuOpen ? 'block' : 'hidden'}`}
  >
    {title}
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MenuProfile = ({ user, isMenuOpen, handleLogout, isLoggingOut }: any) => (
  <div className="flex flex-col gap-1 p-2">
    <MenuSectionTitle isMenuOpen={isMenuOpen} title="Perfil" />
    <div
      className={`flex items-center gap-2 ${isMenuOpen ? 'p-2' : 'flex-col'} text-sm`}
    >
      <Avatar
        alt="Profile"
        src={user?.photoURL || ''}
        sx={{ width: 32, height: 32, borderRadius: '8px' }}
        variant="square"
      />
      {isMenuOpen && (
        <div className="flex flex-col overflow-hidden">
          <span className="overflow-hidden font-medium text-ellipsis whitespace-nowrap">
            {user?.displayName || 'Bem vindo'}
          </span>
          <Tooltip title={user?.email || ''}>
            <span className="overflow-hidden text-xs text-ellipsis whitespace-nowrap">
              {user?.email}
            </span>
          </Tooltip>
        </div>
      )}
      <div style={{ marginLeft: 'auto' }}>
        <IconButton onClick={handleLogout} size="small" disabled={isLoggingOut}>
          {isLoggingOut ? (
            <CircularProgress size={16} style={{ color: '#1b5444' }} />
          ) : (
            <Logout style={{ fontSize: '16px' }} />
          )}
        </IconButton>
      </div>
    </div>
  </div>
);

const MenuItems = ({ isMenuOpen }: { isMenuOpen: boolean }) => (
  <div className="flex flex-col gap-1 p-2">
    <MenuSectionTitle isMenuOpen={isMenuOpen} title="Funções" />
    <CustomMenuItem
      href="/dashboard"
      icon={<DashboardOutlined style={{ fontSize: '16px' }} />}
    >
      Dashboard
    </CustomMenuItem>
    <CustomMenuItem
      href="/dashboard/contacts"
      icon={<ContactsOutlined style={{ fontSize: '16px' }} />}
    >
      Contatos
    </CustomMenuItem>
    <CustomMenuItem
      href="/dashboard/connections"
      icon={<WhatsApp style={{ fontSize: '16px' }} />}
    >
      Conexões
    </CustomMenuItem>
    <CustomMenuItem
      href="/dashboard/broadcast"
      icon={<Podcasts style={{ fontSize: '16px' }} />}
    >
      Transmissões
    </CustomMenuItem>
    <CustomMenuItem
      href="/dashboard/messages"
      icon={<MessageOutlined style={{ fontSize: '16px' }} />}
    >
      Mensagens
    </CustomMenuItem>
  </div>
);

export function Menu() {
  const { user } = useAuth();
  const { isMenuOpen } = useMenu();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    setIsLoggingOut(true);
    await signOut(getAuth(app));
    navigate('/login');
  }

  return (
    <menu
      className={`fixed top-0 z-100 flex h-screen flex-col overflow-hidden px-2 py-5 transition-all duration-300 ${
        isMenuOpen ? 'w-[255px]' : 'w-[64px]'
      }`}
    >
      <MenuTitle isMenuOpen={isMenuOpen} />
      <MenuItems isMenuOpen={isMenuOpen} />
      <MenuProfile
        user={user}
        isMenuOpen={isMenuOpen}
        handleLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </menu>
  );
}
