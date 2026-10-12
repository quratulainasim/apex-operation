'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/navigation/sidebar';
import { TopBar } from '@/components/navigation/top-bar';
import { DemoController } from '@/components/demo/demo-controller';
import { ApprovalDrawer } from '@/components/governance/approval-drawer';
import { useWorkflowStore } from '@/lib/store/use-workflow-store';

interface LayoutShellProps {
  children: React.ReactNode;
}

export const LayoutShell: React.FC<LayoutShellProps> = ({ children }) => {
  const pathname = usePathname();
  const isPublicSurface = pathname === '/' || pathname === '/login' || pathname === '/signup';
  const isApprovalDrawerOpen = useWorkflowStore((s) => s.isApprovalDrawerOpen);
  const setIsApprovalDrawerOpen = useWorkflowStore((s) => s.setIsApprovalDrawerOpen);
  const activeInstanceId = useWorkflowStore((s) => s.activeInstanceId);
  const hasNoInstances = useWorkflowStore((s) => s.instances.length === 0);
  const initDemoState = useWorkflowStore((s) => s.initDemoState);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileNavOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileNavOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileNavOpen]);

  // Initialize demo state if empty on first load
  useEffect(() => {
    if (!isPublicSurface && hasNoInstances) {
      initDemoState();
    }
  }, [hasNoInstances, isPublicSurface, initDemoState]);

  if (isPublicSurface) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen min-h-[100dvh] w-full overflow-hidden font-sans" style={{ backgroundColor: '#F9F8F6', color: '#5A4A42' }}>
      <Sidebar isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />

      {isMobileNavOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 z-40 bg-[#5A4A42]/35 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-gray-50">
        <TopBar onOpenMobileNav={() => setIsMobileNavOpen(true)} />

        <main className="relative flex-1 overflow-x-hidden overflow-y-auto bg-grid-pattern p-4 pb-[calc(8rem+var(--safe-area-bottom))] sm:p-6 sm:pb-28">
          {children}
        </main>
      </div>

      <ApprovalDrawer
        isOpen={isApprovalDrawerOpen}
        onClose={() => setIsApprovalDrawerOpen(false)}
        instanceId={activeInstanceId || undefined}
      />

      <DemoController />
    </div>
  );
};
