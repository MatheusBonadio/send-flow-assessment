import { CustomCard } from '@/app/core/components/ui';
import { Skeleton } from '@mui/material';
import { JSX } from 'react';

const DashboardCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | null;
  icon: JSX.Element;
}) => (
  <CustomCard
    title={title}
    value={
      value !== null ? <>{value}</> : <Skeleton variant="text" width={50} />
    }
    icon={icon}
  />
);

export default DashboardCard;
