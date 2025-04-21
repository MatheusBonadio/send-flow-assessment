import { useEffect, useState } from 'react';
import { Chip } from '@mui/material';
import { Message, StatusMessage, getMessages$ } from '../MessagesModel';
import { CustomTable, StatusFilter } from '@/app/components/ui';
import { useAuth } from '../../auth/useAuth';

const columns = [
  { id: 'contactName', label: 'Contato' },
  { id: 'broadcastName', label: 'Transmissão' },
  { id: 'body', label: 'Mensagem' },
  { id: 'status', label: 'Status' },
  { id: 'scheduledAt', label: 'Agendado para' },
];

const formatMessageBody = (body: string) => (
  <div
    className="float-left my-2 max-w-100 rounded-lg bg-[#d9fdd3] p-2 text-sm"
    style={{ boxShadow: '0 1px .5px #0b141a21' }}
  >
    {body}
  </div>
);

const renderStatusChip = (status: string) => (
  <Chip
    label={status === StatusMessage.Scheduled ? 'Agendada' : 'Enviada'}
    color={status === StatusMessage.Scheduled ? 'default' : 'success'}
    size="small"
    variant="outlined"
    className="my-2"
  />
);

const processTableData = (messages: Message[]) =>
  messages.map((message) => ({
    id: message.id,
    contactName: message.contactName || 'Desconhecido',
    broadcastName: message.broadcastName,
    body: formatMessageBody(message.body),
    scheduledAt: message.scheduledAt.toDate().toLocaleString(),
    status: renderStatusChip(message.status),
  }));

export default function MessageTable() {
  const [statusFilter, setStatusFilter] = useState<StatusMessage>(
    StatusMessage.Scheduled,
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);

    if (!user) throw new Error('Usuário não encontrado!');

    const subscription = getMessages$(user.uid, statusFilter).subscribe(
      async (msgs) => {
        const resolvedMessages = await Promise.all(msgs);
        setMessages(resolvedMessages);
        setLoading(false);
      },
    );

    return () => subscription.unsubscribe();
  }, [statusFilter]);

  const data = processTableData(messages);

  return (
    <div className="flex w-full flex-col gap-4 p-4 text-black">
      <StatusFilter
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <CustomTable columns={columns} data={data} loading={loading} />
    </div>
  );
}
