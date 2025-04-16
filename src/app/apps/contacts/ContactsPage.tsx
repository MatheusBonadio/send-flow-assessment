import React from 'react';
import { Body } from '@/app/components/layout/Body';
import ContactTable from './components/ContactsTable';

const ContactPage: React.FC = () => {
  return (
    <Body title="Contatos">
      <ContactTable />
    </Body>
  );
};

export default ContactPage;
