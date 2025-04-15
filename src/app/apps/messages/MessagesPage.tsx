import React from 'react';
import { Body } from '@/app/components/layout/Body';
import MessageTable from './components/MessagesTable';

const MessagePage: React.FC = () => {
  return (
    <Body title="Mensagens">
      <MessageTable />
    </Body>
  );
};

export default MessagePage;
