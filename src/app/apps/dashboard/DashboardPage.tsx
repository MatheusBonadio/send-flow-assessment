import { Body } from '@/app/components/layout/Body';
import { useBroadcastsCount } from '@/app/apps/broadcasts/BroadcastsModel';
import { useConnectionsCount } from '@/app/apps/connections/ConnectionsModel';
import {
  StatusMessage,
  useMessagesCount,
} from '@/app/apps/messages/MessagesModel';
import DashboardCard from './components/DashboardCard';
import {
  AccessAlarmOutlined,
  ContactsOutlined,
  PodcastsOutlined,
  Send,
  WhatsApp,
} from '@mui/icons-material';
import { useContactsCount } from '../contacts/ContactsModel';
import { useAuth } from '../auth/useAuth';

function Dashboard() {
  const { user } = useAuth();

  if (!user) throw new Error('Usuário não encontrado!');

  const contactCount = useContactsCount(user.uid);
  const connectionCount = useConnectionsCount(user.uid);
  const broadcastCount = useBroadcastsCount(user.uid);
  const messageCountScheduled = useMessagesCount(
    user.uid,
    StatusMessage.Scheduled,
  );
  const messageCountSent = useMessagesCount(user.uid, StatusMessage.Sent);

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
            value={card.value ?? null}
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
