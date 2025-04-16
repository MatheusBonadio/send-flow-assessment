import React from 'react';
import { AccessAlarmOutlined, Send } from '@mui/icons-material';
import { StatusMessage } from '@/app/apps/messages/MessagesModel';

interface StatusFilterProps {
  statusFilter: string;
  setStatusFilter: (status: StatusMessage) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="flex max-w-fit rounded-lg bg-[#f4f4f5] p-1 text-sm font-medium">
      <div
        onClick={() => setStatusFilter(StatusMessage.Scheduled)}
        className={`cursor-pointer rounded-lg px-3 py-1 pl-4 ${
          statusFilter === StatusMessage.Scheduled ? 'bg-white' : ''
        }`}
        style={{
          boxShadow:
            statusFilter === StatusMessage.Scheduled
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
        onClick={() => setStatusFilter(StatusMessage.Sent)}
        className={`cursor-pointer rounded-lg px-3 py-1 pl-4 ${
          statusFilter === StatusMessage.Sent ? 'bg-white' : ''
        }`}
        style={{
          boxShadow:
            statusFilter === StatusMessage.Sent
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
  );
};

export default StatusFilter;
