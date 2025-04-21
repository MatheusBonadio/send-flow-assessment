import { Body } from '@/app/components/layout/Body';
import BroadcastTable from './components/BroadcastsTable';

export default function BroadcastPage() {
  return (
    <Body title="Transmissões">
      <BroadcastTable />
    </Body>
  );
}
