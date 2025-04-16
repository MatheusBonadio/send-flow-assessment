import React from 'react';
import { Body } from '@/app/components/layout/Body';
import ConnectionTable from './components/ConnectionsTable';

const ConnectionPage: React.FC = () => {
  return (
    <Body title="Conexões">
      <ConnectionTable />
    </Body>
  );
};

export default ConnectionPage;
