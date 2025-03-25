import AddButton from '@/presentation/components/ui/AddButton';

interface BroadcastTableHeaderProps {
  onAddBroadcast: () => void;
}

const BroadcastTableHeader: React.FC<BroadcastTableHeaderProps> = ({
  onAddBroadcast,
}) => (
  <div
    className="flex h-13 items-center gap-3 px-4 font-semibold"
    style={{ borderBottom: '1px solid #e4e4e7' }}
  >
    <AddButton onClick={onAddBroadcast} />
    Transmissões
  </div>
);

export default BroadcastTableHeader;
