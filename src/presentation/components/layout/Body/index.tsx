import { MenuOpenOutlined, Menu } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useMenu } from '@/presentation/contexts/MenuContext';

interface BodyProps {
  children: React.ReactNode;
  title: React.ReactNode;
}

export function Body({ children, title }: BodyProps) {
  const { isMenuOpen, toggleMenu } = useMenu();

  return (
    <div
      className={`min-h-[calc(100vh_-_2rem)] overflow-hidden rounded-[1rem] border border-[#e4e4e7] bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.2),0_1px_2px_-1px_rgba(0,0,0,0.2)] transition-all duration-300 ${
        isMenuOpen ? 'm-[1rem_1rem_1rem_255px]' : 'm-[1rem_1rem_1rem_4rem]'
      }`}
    >
      <div
        className="flex h-13 items-center gap-3 px-4 font-semibold"
        style={{ borderBottom: '1px solid #e4e4e7' }}
      >
        <IconButton onClick={toggleMenu}>
          {isMenuOpen ? (
            <MenuOpenOutlined style={{ fontSize: '21px', color: '#000' }} />
          ) : (
            <Menu style={{ fontSize: '21px', color: '#000' }} />
          )}
        </IconButton>
        <div className="mr-2 h-[40%] w-[1px] bg-gray-300"></div>
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
}
