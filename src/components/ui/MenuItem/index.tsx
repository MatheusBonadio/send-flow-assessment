'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export interface CustomMenuItemProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  [key: string]: unknown;
}

const CustomMenuItem: React.FC<CustomMenuItemProps> = ({
  href,
  children,
  icon,
  onClick,
  ...props
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} passHref>
      <div
        className={clsx(
          'flex h-8 cursor-pointer items-center rounded p-2 text-sm transition-colors',
          isActive
            ? 'bg-emerald-100 font-medium text-emerald-700'
            : 'text-gray-700 hover:bg-emerald-100 hover:font-medium hover:text-emerald-700',
        )}
        onClick={onClick}
        {...props}
      >
        {icon && <div className="mr-2">{icon}</div>}
        {children}
      </div>
    </Link>
  );
};

export default CustomMenuItem;
