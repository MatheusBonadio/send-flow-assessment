import React from 'react';
import { Body } from '@/presentation/components/layout/Body';
import ConnectionTable from './components/ConnectionTable';

const ConnectionPage: React.FC = () => {
  return (
    <Body title="Conexões">
      <ConnectionTable />
    </Body>
  );
};

export default ConnectionPage;
