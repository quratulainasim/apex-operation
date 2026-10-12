'use client';

import React from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useWorkflowStore } from '@/lib/store/use-workflow-store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { isWorkflowWaitingApproval, WorkflowInstance } from '@/types/workflow';

export const LiveFeed: React.FC = () => {
  const instances = useWorkflowStore((s) => s.instances);
  const activeInstanceId = useWorkflowStore((s) => s.activeInstanceId);
  const setActiveInstance = useWorkflowStore((s) => s.setActiveInstance);
  const startAutoPlay = useWorkflowStore((s) => s.startAutoPlay);
  const isPlaying = useWorkflowStore((s) => s.isPlaying);
  const setIsApprovalDrawerOpen = useWorkflowStore((s) => s.setIsApprovalDrawerOpen);

  const getStatusBadge = (status: WorkflowInstance['status']) => {
    switch (status) {
      case 'RUNNING':
        return 'bg-blue-600/15 text-blue-500 border-blue-500/40 animate-pulse';
      case 'WAITING_FOR_HUMAN':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40 animate-pulse';
      case 'SUCCESS':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
      case 'FAILED':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/40';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  return (
    <div className="bg-gray-50/80 border border-gray-200/90 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200/80">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <h2 className="text-sm font-bold text-gray-900 tracking-tight uppercase font-mono">
            Active Orchestration Instances
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-300">
            {instances.length} Total
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/intake"
            className="text-xs font-mono text-blue-600 hover:text-blue-500 hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New AI Intake</span>
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        {instances.map((instance) => {
          const completedNodes = instance.nodes.filter((n) => n.status === 'COMPLETED').length;
          const totalNodes = instance.nodes.length;
          const progressPercent = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;
          const isWaitingApproval = isWorkflowWaitingApproval(instance);

          return (
            <div
              key={instance.id}
              className={cn(
                'p-4 rounded-xl border transition-all duration-200 bg-white/70',
                activeInstanceId === instance.id
                  ? 'border-blue-500/50 ring-1 ring-cyan-500/30 bg-white'
                  : 'border-gray-200/80 hover:border-gray-300'
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-gray-900 tracking-tight truncate max-w-[280px]">
                      {instance.title}
                    </span>
                    <span
                      className={cn(
                        'text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold',
                        getStatusBadge(instance.status)
                      )}
                    >
                      {instance.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">
                      ID: {instance.id}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 truncate max-w-xl">
                    {instance.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  {isWaitingApproval && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setActiveInstance(instance.id);
                        setIsApprovalDrawerOpen(true);
                      }}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold gap-1 h-8 shadow-sm shadow-amber-500/20 animate-pulse"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Authorize</span>
                    </Button>
                  )}

                  <Link href={`/workflows/${instance.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveInstance(instance.id)}
                      className="border-gray-300 bg-gray-50 text-gray-800 hover:text-gray-900 hover:bg-gray-100 text-xs gap-1.5 h-8"
                    >
                      <span>Live Canvas</span>
                      <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Progress and Node Counters */}
              <div className="mt-3 pt-3 border-t border-gray-200/60 flex items-center justify-between gap-4 text-xs font-mono">
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>
                      Steps: <strong className="text-gray-800">{completedNodes}</strong> / {totalNodes}
                    </span>
                  </div>
                  <div className="hidden md:flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-600" />
                    <span>
                      Trigger: <span className="text-gray-700">{instance.triggeredBy.actor}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 min-w-[140px] max-w-[200px] w-full">
                  <span className="text-[11px] text-gray-600">{progressPercent}%</span>
                  <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-300',
                        instance.status === 'SUCCESS'
                          ? 'bg-emerald-400'
                          : isWaitingApproval
                          ? 'bg-amber-400'
                          : 'bg-blue-500'
                      )}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
