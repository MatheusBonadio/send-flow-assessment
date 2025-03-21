import React from 'react';

const BroadcastLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header>
        <h1>Broadcast Layout</h1>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default BroadcastLayout;
