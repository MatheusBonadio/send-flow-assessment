import AddButton from '@/presentation/components/ui/AddButton';

interface ContactTableHeaderProps {
  onAddContact: () => void;
}

const ContactTableHeader: React.FC<ContactTableHeaderProps> = ({
  onAddContact,
}) => (
  <div
    className="flex h-13 items-center gap-3 px-4 font-semibold"
    style={{ borderBottom: '1px solid #e4e4e7' }}
  >
    <AddButton onClick={onAddContact} />
    Contatos
  </div>
);

export default ContactTableHeader;
