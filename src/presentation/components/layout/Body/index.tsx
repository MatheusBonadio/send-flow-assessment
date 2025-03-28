import { MenuOpenOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';

interface BodyProps {
  children: React.ReactNode;
  title: string;
}

export function Body({ children, title }: BodyProps) {
  return (
    <div className="m-[1rem_1rem_1rem_255px] min-h-[calc(100vh_-_2rem)] overflow-hidden rounded-[1rem] border border-[#e4e4e7] bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.2),0_1px_2px_-1px_rgba(0,0,0,0.2)]">
      <div
        className="flex h-13 items-center gap-3 px-4 font-semibold"
        style={{ borderBottom: '1px solid #e4e4e7' }}
      >
        <IconButton>
          <MenuOpenOutlined style={{ fontSize: '21px', color: '#000' }} />
        </IconButton>
        <div className="mr-2 h-[40%] w-[1px] bg-gray-300"></div>
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
}
