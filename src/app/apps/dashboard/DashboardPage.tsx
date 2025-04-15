import { Body } from '@/app/components/layout/Body';
import { useBroadcasts } from '@/app/apps/broadcasts/BroadcastsModel';
import { useConnections } from '@/app/apps/connections/ConnectionsModel';
import { useContacts } from '@/app/apps/contacts/ContactsModel';
import { useMessages } from '@/app/apps/messages/MessagesModel';
import DashboardCard from './components/DashboardCard'; // Atualizado
import {
  AccessAlarmOutlined,
  ContactsOutlined,
  PodcastsOutlined,
  Send,
  WhatsApp,
} from '@mui/icons-material';

function Dashboard() {
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

export default function DashboardPage() {
  return (
    <Body title="Dashboard">
      <Dashboard />
    </Body>
  );
}
