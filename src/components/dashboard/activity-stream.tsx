'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  Terminal,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Cpu,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { collectAuditTrail, useWorkflowStore } from '@/lib/store/use-workflow-store';
import { cn } from '@/lib/utils';
import { AuditEvent } from '@/types/audit';

export const ActivityStream: React.FC = () => {
  const instances = useWorkflowStore((s) => s.instances);
  const auditEvents = useMemo(() => collectAuditTrail(instances).slice(0, 10), [instances]);

  const getActorBadge = (actorType: AuditEvent['actorType']) => {
    switch (actorType) {
      case 'AI_AGENT':
        return 'bg-blue-600/10 text-blue-500 border-blue-500/20';
      case 'HUMAN_OPERATOR':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'INTEGRATION_CONNECTOR':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
      case 'SYSTEM_CORE':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  return (
    <div className="bg-gray-50/80 border border-gray-200/90 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200/80">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-gray-900 tracking-tight uppercase font-mono">
            Forensic Telemetry Stream
          </h2>
        </div>

        <Link
          href="/audit"
          className="text-xs font-mono text-blue-600 hover:text-blue-500 hover:underline flex items-center gap-1"
        >
          <span>View Ledger (SHA-256)</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
        {auditEvents.length === 0 ? (
          <div className="p-6 text-center text-xs font-mono text-gray-500">
            No events recorded yet. Run a workflow to stream live execution logs.
          </div>
        ) : (
          auditEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-2.5 rounded-lg bg-white/80 border border-gray-200/70 hover:border-gray-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
            >
              <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                <span className="text-[10px] text-gray-500 whitespace-nowrap">
                  {new Date(evt.timestamp).toLocaleTimeString()}
                </span>
                <span
                  className={cn(
                    'text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold whitespace-nowrap',
                    getActorBadge(evt.actorType)
                  )}
                >
                  {evt.actorType.replace(/_/g, ' ')}
                </span>
                <span className="text-gray-700 font-medium truncate">{evt.summary}</span>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-gray-500 flex-shrink-0 self-end sm:self-center">
                <span className="truncate max-w-[100px] text-gray-600">{evt.workflowId}</span>
                <span className="font-mono text-[9px] text-blue-600/80 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-900/40">
                  {evt.sha256Hash.slice(0, 8)}...
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
