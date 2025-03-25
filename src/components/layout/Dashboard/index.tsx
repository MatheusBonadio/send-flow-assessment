'use client';

import { useEffect, useState } from 'react';
import CustomCard from '@/components/ui/Card';
import {
  ContactsOutlined,
  MessageOutlined,
  PodcastsOutlined,
  WhatsApp,
} from '@mui/icons-material';
import { Skeleton } from '@mui/material';
import { useAlert } from '@/utils/AlertProvider';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/auth/firebase';
import { useAuth } from '@/auth/AuthContext';

export default function Dashboard() {
  const [contactCount, setContactCount] = useState<number | null>(null);
  const [connectionsCount, setConnectionsCount] = useState<number | null>(null);
  const [broadcastsCount, setBroadcastsCount] = useState<number | null>(null);
  const [messagesCount, setMessagesCount] = useState<number | null>(null);
  const { showAlert } = useAlert();
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribeContacts = onSnapshot(
      collection(db, `users/${user?.uid}/contacts`),
      (snapshot) => setContactCount(snapshot.size),
      (error) =>
        showAlert(`Erro ao carregar contatos: ${error.message}`, 'error'),
    );

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
      unsubscribeContacts();
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
