'use client';

import { useEffect, useState } from 'react';
import CustomCard from '@/components/ui/Card';
import {
  ContactsOutlined,
  MessageOutlined,
  PodcastsOutlined,
  WhatsApp,
} from '@mui/icons-material';
import { getContactCount } from '@/services/contactService';
import { CircularProgress } from '@mui/material';
import { useAlert } from '@/utils/AlertProvider';
import { getConnectionCount } from '@/services/connectionService';
import { getBroadcastCount } from '@/services/broadcastService';
import { getMessageCount } from '@/services/messageService';

export default function Dashboard() {
  const [contactCount, setContactCount] = useState<number | null>(null);
  const [connectionsCount, setConnectionsCount] = useState<number | null>(null);
  const [broadcastsCount, setBroadcastsCount] = useState<number | null>(null);
  const [messagesCount, setMessagesCount] = useState<number | null>(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contacts = await getContactCount();
        const connections = await getConnectionCount();
        const broadcasts = await getBroadcastCount();
        const messages = await getMessageCount();

        setContactCount(contacts);
        setConnectionsCount(connections);
        setBroadcastsCount(broadcasts);
        setMessagesCount(messages);
      } catch (error: unknown) {
        showAlert(String(error), 'error');
      }
    };

    fetchData();
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
                <CircularProgress size={20} style={{ color: '#000' }} />
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
                <CircularProgress size={20} style={{ color: '#000' }} />
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
                <CircularProgress size={20} style={{ color: '#000' }} />
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
                <CircularProgress size={20} style={{ color: '#000' }} />
              )
            }
            icon={<MessageOutlined style={{ fontSize: '18px' }} />}
          ></CustomCard>
        </div>
      </div>
    </>
  );
}
