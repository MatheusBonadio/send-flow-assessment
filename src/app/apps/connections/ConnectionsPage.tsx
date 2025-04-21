import { Body } from '@/app/components/layout/Body';
import ConnectionTable from './components/ConnectionsTable';

export default function ConnectionPage() {
  return (
    <Body title="Conexões">
      <ConnectionTable />
    </Body>
  );
}
