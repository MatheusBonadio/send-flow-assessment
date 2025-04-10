import React from 'react';
import { Body } from '@/presentation/components/layout/Body';
import ContactTable from './components/ContactsTable';

const ContactPage: React.FC = () => {
  return (
    <Body title="Contatos">
      <ContactTable />
    </Body>
  );
};

export default ContactPage;
