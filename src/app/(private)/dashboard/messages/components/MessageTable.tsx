'use client';

import React from 'react';
import CustomTable from '@/presentation/components/ui/Table';
import { useMessages } from '@/presentation/hooks/useMessages';
import { Chip } from '@mui/material';
import StatusFilter from '@/presentation/components/ui/StatusFilter';
import { Message } from '@/core/entities/message';

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
    label={status === 'scheduled' ? 'Agendada' : 'Enviada'}
    color={status === 'scheduled' ? 'default' : 'success'}
    size="small"
    variant="outlined"
    className="my-2"
  />
);

const processTableData = (messages: Message[]) =>
  messages.map((message) => ({
    id: message.id,
    contactName: message.contactName,
    broadcastName: message.broadcastName,
    body: formatMessageBody(message.body),
    scheduledAt: message.scheduledAt.toLocaleString(),
    status: renderStatusChip(message.status),
  }));

const MessageTable: React.FC = () => {
  const { messagesScheduled, messagesSent, loading } = useMessages();
  const [statusFilter, setStatusFilter] = React.useState('scheduled');
  const [messageSource] = React.useState<'scheduled' | 'sent'>('scheduled');

  const getFilteredMessages = () => {
    if (statusFilter === 'sent') return messagesSent;
    if (statusFilter === 'scheduled') return messagesScheduled;
    return messageSource === 'scheduled' ? messagesScheduled : messagesSent;
  };

  const messages = getFilteredMessages();
  const data = processTableData(messages);

  return (
    <>
      <div className="flex w-full flex-col gap-4 p-4 text-black">
        <StatusFilter
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <CustomTable columns={columns} data={data} loading={loading} />
      </div>
    </>
  );
};

export default MessageTable;
