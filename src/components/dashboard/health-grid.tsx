'use client';

import React from 'react';
import {
  Server,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Globe,
} from 'lucide-react';
import { useWorkflowStore } from '@/lib/store/use-workflow-store';
import { cn } from '@/lib/utils';

export const HealthGrid: React.FC = () => {
  const serviceHealth = useWorkflowStore((s) => s.serviceHealth);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPERATIONAL':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'DEGRADED':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="bg-gray-50/80 border border-gray-200/90 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200/80">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-gray-900 tracking-tight uppercase font-mono">
            Enterprise Connectors Grid
          </h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
          All Systems Nominal
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(serviceHealth).map(([key, service]) => (
          <div
            key={key}
            className="p-3 rounded-xl bg-white/70 border border-gray-200/90 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-mono font-bold text-gray-800 truncate">
                {key}
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <p className="text-[10px] text-gray-600 truncate mb-2">{service.name}</p>

            <div className="space-y-1 text-[10px] font-mono">
              <div className="flex items-center justify-between text-gray-600">
                <span>Latency</span>
                <span className="text-blue-500 font-semibold">{service.latencyMs}ms</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>SLA Uptime</span>
                <span className="text-emerald-400 font-semibold">{service.uptimePercent}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
