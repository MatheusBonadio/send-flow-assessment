'use client';

import React, { useEffect, useState } from 'react';
import { Chip } from '@mui/material';
import CustomTable from '@/components/ui/Table';
import { IMessage } from '@/services/messageService';
import {
  getAllMessagesScheduled,
  getAllMessagesSent,
} from '@/services/messageService';
import { useAlert } from '@/utils/AlertProvider';
import { AccessAlarmOutlined, Send } from '@mui/icons-material';

const columns = [
  { id: 'contactName', label: 'Contato' },
  { id: 'broadcastName', label: 'Transmissão' },
  { id: 'body', label: 'Mensagem' },
  { id: 'status', label: 'Status' },
  { id: 'scheduledAt', label: 'Agendado para' },
];

const MessageTable: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'scheduled' | 'sent'>(
    'scheduled',
  );
  const { showAlert } = useAlert();

  const fetchMessages = React.useCallback(async () => {
    setLoading(true);

    try {
      let fetchedMessages: IMessage[] = [];
      if (statusFilter === 'scheduled') {
        fetchedMessages = await getAllMessagesScheduled();
      } else {
        fetchedMessages = await getAllMessagesSent();
      }

      setMessages(fetchedMessages);
    } catch (error: unknown) {
      showAlert(String(error), 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, showAlert]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const data = messages.map((message) => ({
    id: message.id,
    body: (
      <div
        className="float-left my-2 max-w-100 rounded-lg bg-[#d9fdd3] p-2 text-sm"
        style={{ boxShadow: '0 1px .5px #0b141a21' }}
      >
        {message.body}
      </div>
    ),
    contactName: message.contactName,
    broadcastName: message.broadcastName,
    status: (
      <Chip
        label={message.status === 'scheduled' ? 'Agendada' : 'Enviada'}
        color={message.status === 'scheduled' ? 'default' : 'success'}
        size="small"
        variant="outlined"
        className="my-2"
      />
    ),
    scheduledAt: message.scheduledAt.toLocaleString(),
  }));

  const toggleStatusFilter = (newStatus: 'scheduled' | 'sent') => {
    setStatusFilter(newStatus);
  };

  return (
    <>
      <div
        className="flex h-13 items-center gap-3 px-4 font-semibold"
        style={{ borderBottom: '1px solid #e4e4e7' }}
      >
        Mensagens
      </div>
      <div className="flex w-full flex-col gap-4 p-4 text-black">
        <div className="flex max-w-fit rounded-lg bg-[#f4f4f5] p-1 text-sm font-medium">
          <div
            onClick={() => toggleStatusFilter('scheduled')}
            className={`cursor-pointer rounded-lg px-3 py-1 pl-4 ${
              statusFilter === 'scheduled' ? 'bg-white' : ''
            }`}
            style={{
              boxShadow:
                statusFilter === 'scheduled'
                  ? '0 0 #0000, 0 0 #0000, 0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px -1px rgba(0, 0, 0, .1)'
                  : 'none',
            }}
          >
            <AccessAlarmOutlined
              style={{
                fontSize: '16px',
                position: 'relative',
                top: -1,
                left: -4,
              }}
            />
            Agendadas
          </div>
          <div
            onClick={() => toggleStatusFilter('sent')}
            className={`cursor-pointer rounded-lg px-3 py-1 pl-4 ${
              statusFilter === 'sent' ? 'bg-white' : ''
            }`}
            style={{
              boxShadow:
                statusFilter === 'sent'
                  ? '0 0 #0000, 0 0 #0000, 0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px -1px rgba(0, 0, 0, .1)'
                  : 'none',
            }}
          >
            <Send
              style={{
                fontSize: '16px',
                position: 'relative',
                top: -1,
                left: -4,
              }}
            />
            Enviadas
          </div>
        </div>
        <CustomTable columns={columns} data={data} loading={loading} />
      </div>
    </>
  );
};

export default MessageTable;
