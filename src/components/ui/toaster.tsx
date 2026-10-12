'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#11131F',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          color: '#F8FAFC',
          fontFamily: 'var(--font-sans)',
          fontSize: '12px',
          borderRadius: '10px',
          boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.6)',
        },
        classNames: {
          title: 'font-semibold text-xs tracking-tight',
          description: 'text-gray-600 text-[11px] mt-0.5',
          actionButton: 'bg-blue-600 text-gray-900 text-[11px] font-medium px-2 py-1 rounded',
          cancelButton: 'bg-gray-100 text-gray-700 text-[11px] px-2 py-1 rounded',
        },
      }}
    />
  );
}
