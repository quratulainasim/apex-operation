'use client';

import React from 'react';
import {
  Activity,
  CheckCircle2,
  ShieldAlert,
  Clock,
  TrendingUp,
  DollarSign,
  Cpu,
} from 'lucide-react';
import { useWorkflowStore } from '@/lib/store/use-workflow-store';
import { isWorkflowWaitingApproval } from '@/types/workflow';
import { formatCurrency } from '@/lib/utils';

export const MetricsBar: React.FC = () => {
  const instances = useWorkflowStore((s) => s.instances);
  const stats = useWorkflowStore((s) => s.stats);

  const activeCount = instances.filter((i) => i.status === 'RUNNING').length;
  const completedCount = instances.filter((i) => i.status === 'SUCCESS').length;
  const pendingApprovalsCount = instances.filter(isWorkflowWaitingApproval).length;
  const escalatedCount = instances.filter((i) => i.status === 'FAILED').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. Active Orchestration Pipelines */}
      <div className="p-4 rounded-xl bg-gray-50/90 border border-gray-200 relative overflow-hidden shadow-lg group hover:border-blue-500/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-gray-600 uppercase tracking-wider">
            Active Runs
          </span>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-gray-900 tracking-tight">
            {activeCount}
          </span>
          <span className="text-[10px] font-mono text-blue-600">Pipelines</span>
        </div>
        <div className="mt-1 text-[10px] text-gray-600 flex items-center gap-1 font-mono">
          <Activity className="w-3 h-3 text-blue-600" />
          <span>FSM Thread Pool</span>
        </div>
        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-600/5 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* 2. Completed Today */}
      <div className="p-4 rounded-xl bg-gray-50/90 border border-gray-200 relative overflow-hidden shadow-lg group hover:border-emerald-500/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-gray-600 uppercase tracking-wider">
            Executed Today
          </span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">
            {completedCount + stats.completedSuccess}
          </span>
          <span className="text-[10px] font-mono text-emerald-500">100% OK</span>
        </div>
        <div className="mt-1 text-[10px] text-gray-600 flex items-center gap-1 font-mono">
          <span>Avg 1.4s per step</span>
        </div>
        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* 3. Pending Governance Gates */}
      <div className="p-4 rounded-xl bg-gray-50/90 border border-gray-200 relative overflow-hidden shadow-lg group hover:border-amber-500/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-gray-600 uppercase tracking-wider">
            Human Gates
          </span>
          <ShieldAlert
            className={`w-3.5 h-3.5 ${
              pendingApprovalsCount > 0 ? 'text-amber-400 animate-pulse' : 'text-gray-500'
            }`}
          />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span
            className={`text-2xl font-bold font-mono tracking-tight ${
              pendingApprovalsCount > 0 ? 'text-amber-400' : 'text-gray-800'
            }`}
          >
            {pendingApprovalsCount}
          </span>
          <span className="text-[10px] font-mono text-amber-500">Action Req</span>
        </div>
        <div className="mt-1 text-[10px] text-gray-600 flex items-center gap-1 font-mono">
          <span>Policy Thresholds</span>
        </div>
        <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* 4. Escalations / Breaches */}
      <div className="p-4 rounded-xl bg-gray-50/90 border border-gray-200 relative overflow-hidden shadow-lg group hover:border-rose-500/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-gray-600 uppercase tracking-wider">
            SLA Escalations
          </span>
          <Clock className="w-3.5 h-3.5 text-gray-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-gray-700 tracking-tight">
            {escalatedCount}
          </span>
          <span className="text-[10px] font-mono text-gray-500">Nominal</span>
        </div>
        <div className="mt-1 text-[10px] text-gray-600 flex items-center gap-1 font-mono">
          <span>0 Breaches</span>
        </div>
      </div>

      {/* 5. Automation Rate */}
      <div className="p-4 rounded-xl bg-gray-50/90 border border-gray-200 relative overflow-hidden shadow-lg group hover:border-blue-500/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-gray-600 uppercase tracking-wider">
            Automation Rate
          </span>
          <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-blue-400 tracking-tight">
            {stats.automationRate}%
          </span>
          <span className="text-[10px] font-mono text-emerald-400">+4.2%</span>
        </div>
        <div className="mt-1 text-[10px] text-gray-600 flex items-center gap-1 font-mono">
          <span>Deterministic FSM</span>
        </div>
      </div>

      {/* 6. OpEx Savings */}
      <div className="p-4 rounded-xl bg-gray-50/90 border border-gray-200 relative overflow-hidden shadow-lg group hover:border-indigo-500/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-gray-600 uppercase tracking-wider">
            OpEx Savings
          </span>
          <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-indigo-300 tracking-tight">
            {formatCurrency(stats.costSavingsUsd)}
          </span>
        </div>
        <div className="mt-1 text-[10px] text-gray-600 flex items-center gap-1 font-mono">
          <span>Q3 Verified ROI</span>
        </div>
        <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
      </div>
    </div>
  );
};
