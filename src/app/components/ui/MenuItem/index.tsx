import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface CustomMenuItemProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  [key: string]: unknown;
}

const CustomMenuItem: React.FC<CustomMenuItemProps> = ({
  href,
  children,
  icon,
  onClick,
  disabled = false,
  ...props
}) => {
  const location = useLocation();
  const pathname = location.pathname;
  const isActive = pathname === href;

  const handleClick = () => {
    if (disabled) return;

    if (onClick) onClick();
  };

  return (
    <Link to={href}>
      <div
        className={`flex h-8 cursor-pointer items-center overflow-hidden rounded p-2 text-sm transition-colors ${
          isActive
            ? 'bg-emerald-100 font-medium text-emerald-700'
            : 'text-gray-700 hover:bg-emerald-100 hover:font-medium hover:text-emerald-700'
        }`}
        onClick={handleClick}
        {...props}
      >
        {icon && <div className="mr-2">{icon}</div>}
        {children}
      </div>
    </Link>
  );
};

export default CustomMenuItem;
