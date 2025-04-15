import React from 'react';
import { Body } from '@/app/components/layout/Body';
import BroadcastTable from './components/BroadcastsTable';

const BroadcastPage: React.FC = () => {
  return (
    <Body title="Broadcasts">
      <BroadcastTable />
    </Body>
  );
};

export default BroadcastPage;
