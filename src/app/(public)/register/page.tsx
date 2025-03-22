'use client';

import Register from '@/components/layout/Register';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="mb-4 flex items-center justify-center select-none">
        <div
          className="justify-centers flex h-6 w-6 items-center rounded-lg"
          style={{ backgroundColor: '#66c0a6' }}
        >
          <img
            src="unnichat-logo.png"
            alt="Unnichat Logo"
            className="ml-1 w-4"
          />
        </div>
        <span className="ml-2 text-lg font-semibold tracking-tight">
          UnniChat
        </span>
      </div>
      <Register />
    </div>
  );
}
