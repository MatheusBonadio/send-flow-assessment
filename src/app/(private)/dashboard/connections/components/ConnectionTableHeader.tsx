import AddButton from '@/presentation/components/ui/AddButton';

interface ConnectionTableHeaderProps {
  onAddConnection: () => void;
}

const ConnectionTableHeader: React.FC<ConnectionTableHeaderProps> = ({
  onAddConnection,
}) => (
  <div
    className="flex h-13 items-center gap-3 px-4 font-semibold"
    style={{ borderBottom: '1px solid #e4e4e7' }}
  >
    <AddButton onClick={onAddConnection} />
    Conexões
  </div>
);

export default ConnectionTableHeader;
