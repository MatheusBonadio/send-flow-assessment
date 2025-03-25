'use client';

import { useEffect, useState } from 'react';
import CustomCard from '@/presentation/components/ui/Card';
import {
  ContactsOutlined,
  MessageOutlined,
  PodcastsOutlined,
  WhatsApp,
} from '@mui/icons-material';
import { Skeleton } from '@mui/material';
import { useAlert } from '@/presentation/providers/AlertProvider';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/infrastructure/firebase/firebase';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { useContacts } from '@/presentation/hooks/useContacts';

export default function Dashboard() {
  const { contactCount } = useContacts();
  const [connectionsCount, setConnectionsCount] = useState<number | null>(null);
  const [broadcastsCount, setBroadcastsCount] = useState<number | null>(null);
  const [messagesCount, setMessagesCount] = useState<number | null>(null);
  const { showAlert } = useAlert();
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribeConnections = onSnapshot(
      collection(db, `users/${user?.uid}/connections`),
      (snapshot) => setConnectionsCount(snapshot.size),
      (error) =>
        showAlert(`Erro ao carregar conexões: ${error.message}`, 'error'),
    );

    const unsubscribeBroadcasts = onSnapshot(
      collection(db, `users/${user?.uid}/broadcasts`),
      (snapshot) => setBroadcastsCount(snapshot.size),
      (error) =>
        showAlert(`Erro ao carregar transmissões: ${error.message}`, 'error'),
    );

    const unsubscribeMessages = onSnapshot(
      collection(db, `users/${user?.uid}/messages`),
      (snapshot) => setMessagesCount(snapshot.size),
      (error) =>
        showAlert(`Erro ao carregar mensagens: ${error.message}`, 'error'),
    );

    return () => {
      unsubscribeConnections();
      unsubscribeBroadcasts();
      unsubscribeMessages();
    };
  }, [showAlert]);

  return (
    <>
      <div
        className="flex h-13 items-center gap-3 px-4 font-semibold"
        style={{ borderBottom: '1px solid #e4e4e7' }}
      >
        Dashboard
      </div>
      <div className="flex w-full flex-col justify-between gap-4 p-4 text-black">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CustomCard
            title="Contatos"
            value={
              contactCount !== null ? (
                <>{contactCount}</>
              ) : (
                <Skeleton variant="text" width={50} />
              )
            }
            icon={<ContactsOutlined style={{ fontSize: '18px' }} />}
          ></CustomCard>
          <CustomCard
            title="Conexões"
            value={
              connectionsCount !== null ? (
                <>{connectionsCount}</>
              ) : (
                <Skeleton variant="text" width={50} />
              )
            }
            icon={<WhatsApp style={{ fontSize: '18px' }} />}
          ></CustomCard>
          <CustomCard
            title="Transmissões"
            value={
              broadcastsCount !== null ? (
                <>{broadcastsCount}</>
              ) : (
                <Skeleton variant="text" width={50} />
              )
            }
            icon={<PodcastsOutlined style={{ fontSize: '18px' }} />}
          ></CustomCard>
          <CustomCard
            title="Mensagens"
            value={
              messagesCount !== null ? (
                <>{messagesCount}</>
              ) : (
                <Skeleton variant="text" width={50} />
              )
            }
            icon={<MessageOutlined style={{ fontSize: '18px' }} />}
          ></CustomCard>
        </div>
      </div>
    </>
  );
}
