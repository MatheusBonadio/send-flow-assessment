import { Body } from '@/app/components/layout/Body';
import ContactTable from './components/ContactsTable';

export default function ContactPage() {
  return (
    <Body title="Contatos">
      <ContactTable />
    </Body>
  );
}
