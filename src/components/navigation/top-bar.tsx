'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  Bell,
  Sliders,
  ShieldCheck,
  RefreshCw,
  Plus,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkflowStore } from '@/lib/store/use-workflow-store';
import { toast } from 'sonner';
import { getCurrentSession, logout, type AuthSession } from '@/lib/auth';

interface TopBarProps {
  onOpenMobileNav: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobileNav }) => {
  const instances = useWorkflowStore((s) => s.instances);
  const activeInstanceId = useWorkflowStore((s) => s.activeInstanceId);
  const initDemoState = useWorkflowStore((s) => s.initDemoState);
  const activeInstance = instances.find((i) => i.id === activeInstanceId);
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    let isMounted = true;

    void getCurrentSession().then((currentSession) => {
      if (isMounted) setSession(currentSession);
    }).catch(() => {
      if (isMounted) setSession(null);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleResetData = () => {
    initDemoState();
    toast.success('Demonstration state re-synchronized successfully.');
  };

  return (
    <header className="relative z-20 flex min-h-16 items-center justify-between gap-2 border-b border-gray-200/80 bg-white/80 px-3 pb-[var(--safe-area-top)] pt-[var(--safe-area-top)] backdrop-blur-md sm:px-6 lg:pb-0 lg:pt-0">
      {/* Left: Mobile navigation and active context */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onOpenMobileNav}
          aria-label="Open navigation"
          className="shrink-0 text-gray-600 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex min-w-0 items-center gap-2 text-xs">
          <span className="font-mono text-gray-500 sm:hidden">APEX</span>
          <span className="hidden font-mono text-gray-500 sm:inline">APEX OPERATIONS</span>
          <span className="text-slate-700">/</span>
          <span className="truncate font-medium text-gray-700">Enterprise Orchestration Grid</span>
        </div>

        {activeInstance && (
          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-gray-200 text-xs font-mono">
            <span className="text-gray-500">Active Workflow:</span>
            <Link
              href={`/workflows/${activeInstance.id}`}
              className="text-blue-600 hover:text-blue-500 hover:underline max-w-[280px] truncate"
            >
              {activeInstance.title}
            </Link>
          </div>
        )}
      </div>

      {/* Right: Actions & Controls */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        {session && (
          <div className="hidden items-center gap-2 text-right sm:block">
            <span className="block text-[11px] font-semibold text-gray-700">{session.name}</span>
            <span className="block text-[10px] font-mono text-gray-500">{session.email}</span>
          </div>
        )}

        <Link href="/intake">
          <Button
            variant="outline"
            size="sm"
            className="border-blue-500/40 bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 hover:text-cyan-200 gap-1.5 shadow-sm shadow-blue-500/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">AI Request Intake</span>
          </Button>
        </Link>

        <Button
          variant="outline"
          size="sm"
          onClick={handleResetData}
          title="Reset Simulation State"
          className="border-gray-200 bg-gray-50 text-gray-700 hover:text-gray-900 hover:bg-gray-100 gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5 text-gray-600" />
          <span className="hidden sm:inline">Sync Demo</span>
        </Button>

        {/* Security & SOC Badge */}
        <div className="hidden items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-mono text-gray-700 md:flex">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-[11px]">SOC2 Type II</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={async () => {
            try {
              await logout();
            } finally {
              window.location.href = '/';
            }
          }}
          className="px-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 sm:px-3"
        >
          <span className="hidden sm:inline">Sign out</span>
          <span className="sm:hidden">Exit</span>
        </Button>
      </div>
    </header>
  );
};
