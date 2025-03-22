'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

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
  const pathname = usePathname();
  const isActive = pathname === href;
  const [, startTransition] = useTransition();

  const handleClick = () => {
    if (disabled) return;

    startTransition(() => {
      if (onClick) onClick();
    });
  };

  return (
    <Link href={href} passHref>
      <div
        className={clsx(
          'flex h-8 cursor-pointer items-center rounded p-2 text-sm transition-colors',
          isActive
            ? 'bg-emerald-100 font-medium text-emerald-700'
            : 'text-gray-700 hover:bg-emerald-100 hover:font-medium hover:text-emerald-700',
        )}
        onClick={handleClick}
        {...props}
      >
        {/* {isPending ? (
          <CircularProgress
            size={16}
            className="mr-2"
            style={{ color: '#1b5444' }}
          />
        ) : (
          icon && <div className="mr-2">{icon}</div>
        )} */}
        <div className="mr-2">{icon}</div>
        {children}
      </div>
    </Link>
  );
};

export default CustomMenuItem;
