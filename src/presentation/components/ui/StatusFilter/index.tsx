import React from 'react';
import { AccessAlarmOutlined, Send } from '@mui/icons-material';

interface StatusFilterProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="flex max-w-fit rounded-lg bg-[#f4f4f5] p-1 text-sm font-medium">
      <div
        onClick={() => setStatusFilter('scheduled')}
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
        onClick={() => setStatusFilter('sent')}
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
  );
};

export default StatusFilter;
