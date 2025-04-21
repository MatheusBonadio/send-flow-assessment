import { Body } from '@/app/components/layout/Body';
import MessageTable from './components/MessagesTable';

export default function MessagePage() {
  return (
    <Body title="Mensagens">
      <MessageTable />
    </Body>
  );
}
