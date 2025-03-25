'use client';

import React from 'react';

export interface CustomMenuItemProps {
  title: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}

const CustomMenuItem: React.FC<CustomMenuItemProps> = ({
  title,
  value,
  icon,
}) => {
  return (
    <div
      className="rounded-xl border border-[#e4e4e7] shadow"
      style={{
        boxShadow: '0 1px 3px 0 rgba(0,0,0,.2),0 1px 2px -1px rgba(0,0,0,.2)',
      }}
    >
      <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
        <div className="text-sm font-semibold tracking-tight text-gray-700">
          {title}
        </div>
        <div className="text-gray-700">{icon}</div>
      </div>
      <div className="p-6 pt-0">
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
};

export default CustomMenuItem;
