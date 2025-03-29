'use client';

import CustomCard from '@/presentation/components/ui/Card';
import {
  AccessAlarmOutlined,
  ContactsOutlined,
  PodcastsOutlined,
  Send,
  WhatsApp,
} from '@mui/icons-material';
import { Skeleton } from '@mui/material';
import { useContacts } from '@/presentation/hooks/useContacts';
import { useConnections } from '@/presentation/hooks/useConnections';
import { useBroadcasts } from '@/presentation/hooks/useBroadcasts';
import { useMessages } from '@/presentation/hooks/useMessages';
import { JSX } from 'react';

const DashboardCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | null;
  icon: JSX.Element;
}) => (
  <CustomCard
    title={title}
    value={
      value !== null ? <>{value}</> : <Skeleton variant="text" width={50} />
    }
    icon={icon}
  />
);

export default function Dashboard() {
  const { contactCount } = useContacts();
  const { connectionCount } = useConnections();
  const { broadcastCount } = useBroadcasts();
  const { messageCountScheduled, messageCountSent } = useMessages();

  const cardsData = [
    {
      title: 'Contatos',
      value: contactCount,
      icon: <ContactsOutlined style={{ fontSize: '18px' }} />,
    },
    {
      title: 'Conexões',
      value: connectionCount,
      icon: <WhatsApp style={{ fontSize: '18px' }} />,
    },
    {
      title: 'Transmissões',
      value: broadcastCount,
      icon: <PodcastsOutlined style={{ fontSize: '18px' }} />,
    },
    {
      title: 'Mensagens Agendadas',
      value: messageCountScheduled,
      icon: <AccessAlarmOutlined style={{ fontSize: '18px' }} />,
    },
    {
      title: 'Mensagens Enviadas',
      value: messageCountSent,
      icon: <Send style={{ fontSize: '18px' }} />,
    },
  ];

  return (
    <div className="flex w-full flex-col justify-between gap-4 p-4 text-black">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cardsData.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
          />
        ))}
      </div>
    </div>
  );
}
