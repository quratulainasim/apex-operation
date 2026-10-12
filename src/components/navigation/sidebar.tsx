'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  PlaySquare,
  ShieldAlert,
  Library,
  Layers,
  FileCheck2,
  Sparkles,
  Server,
  ChevronRight,
  Activity,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkflowStore } from '@/lib/store/use-workflow-store';
import { isWorkflowWaitingApproval } from '@/types/workflow';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const instances = useWorkflowStore((s) => s.instances);
  const pendingApprovalsCount = instances.filter(isWorkflowWaitingApproval).length;

  const runningCount = instances.filter((i) => i.status === 'RUNNING').length;

  const navItems = [
    {
      href: '/dashboard',
      label: 'Command Center',
      icon: LayoutDashboard,
      badge: runningCount > 0 ? `${runningCount} Active` : undefined,
      badgeColor: 'text-blue-600 bg-blue-600/10 border-blue-500/20',
    },
    {
      href: '/intake',
      label: 'AI Request Studio',
      icon: Sparkles,
      highlight: true,
    },
    {
      href: '/workflows',
      label: 'Workflow Catalog',
      icon: Library,
      badge: '5 Presets',
    },
    {
      href: '/workflows/builder',
      label: 'Workflow Builder',
      icon: Layers,
    },
    {
      href: '/approvals',
      label: 'Human Governance',
      icon: ShieldAlert,
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} Pending` : undefined,
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30 animate-pulse',
    },
    {
      href: '/audit',
      label: 'Forensic Audit Log',
      icon: FileCheck2,
      badge: 'SHA-256',
    },
  ];

  return (
    <aside
      aria-label="Primary navigation"
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex w-72 flex-shrink-0 -translate-x-full flex-col justify-between bg-white pt-[var(--safe-area-top)] pb-[var(--safe-area-bottom)] select-none shadow-xl transition-transform duration-300 ease-out lg:static lg:z-30 lg:w-64 lg:translate-x-0 lg:pt-0 lg:pb-0 lg:shadow-sm',
        isOpen && 'translate-x-0'
      )}
      style={{ borderRight: '1px solid rgba(201, 181, 156, 0.3)' }}
    >
      {/* Brand Logo & Header */}
      <div>
        <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-5">
          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-500 shadow-md shadow-blue-500/20">
            <Activity className="h-4 w-4 animate-pulse text-gray-900" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-bold tracking-tight text-gray-900">APEX OPERATIONS</span>
              <span className="rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 font-mono text-[10px] text-blue-600">
                AI
              </span>
            </div>
            <p className="truncate font-mono text-[10px] text-gray-500">Autonomous Enterprise FSM</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex h-11 w-11 flex-none items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-gray-500">
            Platform Modules
          </div>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === '/workflows' &&
                pathname.startsWith('/workflows/') &&
                pathname !== '/workflows/builder') ||
              (item.href !== '/dashboard' &&
                item.href !== '/workflows' &&
                pathname.startsWith(`${item.href}/`));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex min-h-11 items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all group',
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-colors',
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-mono px-1.5 py-0.5 rounded border',
                      item.badgeColor || 'text-gray-500 bg-gray-100 border-gray-200'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer System Status Card */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="p-3 rounded-xl bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-gray-700">Cluster Telemetry</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              100% OK
            </span>
          </div>
          <p className="text-[10px] text-gray-500 leading-relaxed font-mono">
            Deterministic FSM Engine Active • Gemini Structured Intake
          </p>
        </div>
      </div>
    </aside>
  );
};
