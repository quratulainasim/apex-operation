'use client';

import React from 'react';
import { WorkflowNode } from '@/types/workflow';
import {
  Layers,
  Sparkles,
  Database,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  Bell,
  Clock,
  AlertTriangle,
  Play,
  Check,
  XCircle,
  RotateCcw,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface WorkflowNodeCardProps {
  node: WorkflowNode;
  isSelected?: boolean;
  onSelect?: (node: WorkflowNode) => void;
  scale?: number;
}

const SERVICE_CONFIG: Record<
  string,
  { label: string; color: string; border: string; bg: string; icon: string }
> = {
  SALESFORCE: {
    label: 'Salesforce CRM',
    color: 'text-sky-400',
    border: 'border-sky-500/30',
    bg: 'bg-sky-500/10',
    icon: '☁️',
  },
  SAP: {
    label: 'SAP S/4HANA',
    color: 'text-blue-400',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
    icon: '🔷',
  },
  JIRA: {
    label: 'Jira Cloud',
    color: 'text-indigo-400',
    border: 'border-indigo-500/30',
    bg: 'bg-indigo-500/10',
    icon: '🎯',
  },
  STRIPE: {
    label: 'Stripe Billing',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    icon: '💳',
  },
  SLACK: {
    label: 'Slack Grid',
    color: 'text-purple-400',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
    icon: '💬',
  },
  AWS: {
    label: 'AWS Cloud',
    color: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    icon: '⚡',
  },
  OKTA: {
    label: 'Okta Identity',
    color: 'text-blue-600',
    border: 'border-blue-500/30',
    bg: 'bg-blue-600/10',
    icon: '🛡️',
  },
  INTERNAL_ENGINE: {
    label: 'FlowOps Engine',
    color: 'text-blue-500',
    border: 'border-blue-500/30',
    bg: 'bg-blue-600/10',
    icon: '⚙️',
  },
};

export const WorkflowNodeCard: React.FC<WorkflowNodeCardProps> = ({
  node,
  isSelected,
  onSelect,
}) => {
  const serviceInfo = SERVICE_CONFIG[node.service] || SERVICE_CONFIG.INTERNAL_ENGINE;

  const getNodeTypeBadge = () => {
    switch (node.type) {
      case 'TRIGGER':
        return (
          <span className="text-[10px] font-mono tracking-wider text-purple-300 uppercase px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 flex items-center gap-1">
            <Play className="w-2.5 h-2.5 fill-purple-400" /> Trigger
          </span>
        );
      case 'AI_TRANSFORM':
        return (
          <span className="text-[10px] font-mono tracking-wider text-blue-500 uppercase px-1.5 py-0.5 rounded bg-blue-600/10 border border-blue-500/20 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-blue-600" /> AI Transform
          </span>
        );
      case 'HUMAN_APPROVAL':
        return (
          <span className="text-[10px] font-mono tracking-wider text-amber-300 uppercase px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 flex items-center gap-1 animate-pulse">
            <ShieldCheck className="w-2.5 h-2.5 text-amber-400" /> Governance Gate
          </span>
        );
      case 'INTEGRATION_ACTION':
        return (
          <span className="text-[10px] font-mono tracking-wider text-blue-300 uppercase px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 flex items-center gap-1">
            <Database className="w-2.5 h-2.5 text-blue-400" /> Tool Action
          </span>
        );
      case 'NOTIFICATION':
        return (
          <span className="text-[10px] font-mono tracking-wider text-indigo-300 uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-1">
            <Bell className="w-2.5 h-2.5 text-indigo-400" /> Dispatch
          </span>
        );
      case 'VERIFICATION_ASSERTION':
        return (
          <span className="text-[10px] font-mono tracking-wider text-emerald-300 uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> Assert
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusDisplay = () => {
    switch (node.status) {
      case 'RUNNING':
        return (
          <div className="flex items-center gap-1.5 text-xs text-blue-600 font-mono">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
            <span>RUNNING</span>
          </div>
        );
      case 'WAITING_APPROVAL':
        return (
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>NEEDS APPROVAL</span>
          </div>
        );
      case 'COMPLETED':
        return (
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-mono font-medium">
            <Check className="w-3.5 h-3.5" />
            <span>{node.executionMetrics?.durationMs ? `${node.executionMetrics.durationMs}ms` : 'DONE'}</span>
          </div>
        );
      case 'FAILED':
        return (
          <div className="flex items-center gap-1 text-xs text-rose-400 font-mono">
            <XCircle className="w-3.5 h-3.5" />
            <span>FAILED</span>
          </div>
        );
      case 'COMPENSATED':
        return (
          <div className="flex items-center gap-1 text-xs text-orange-400 font-mono">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ROLLBACK</span>
          </div>
        );
      case 'SKIPPED':
        return (
          <div className="flex items-center gap-1 text-xs text-gray-500 font-mono">
            <span>SKIPPED</span>
          </div>
        );
      case 'PENDING':
      case 'IDLE':
      default:
        return (
          <div className="flex items-center gap-1 text-xs text-gray-600 font-mono">
            <Clock className="w-3 h-3 text-gray-500" />
            <span>QUEUED</span>
          </div>
        );
    }
  };

  // Node container styling based on status
  const getContainerStyle = () => {
    if (isSelected) {
      return 'border-cyan-400 ring-2 ring-cyan-400/30 bg-gray-50/95 shadow-lg shadow-blue-500/10';
    }
    switch (node.status) {
      case 'RUNNING':
        return 'border-blue-500/80 bg-gray-50/90 shadow-lg shadow-blue-500/20 ring-1 ring-cyan-400/50';
      case 'WAITING_APPROVAL':
        return 'border-amber-500/80 bg-gray-50/90 shadow-xl shadow-amber-500/20 ring-1 ring-amber-400/60 animate-pulse';
      case 'COMPLETED':
        return 'border-emerald-500/40 bg-gray-50/80 hover:border-emerald-500/60';
      case 'FAILED':
        return 'border-rose-500/60 bg-gray-50/80';
      case 'COMPENSATED':
        return 'border-orange-500/60 bg-gray-50/80';
      case 'SKIPPED':
        return 'border-gray-200/50 bg-white/40 opacity-50';
      default:
        return 'border-gray-200/80 bg-gray-50/70 hover:border-gray-300';
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(node);
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      role="button"
      tabIndex={0}
      className={cn(
        'w-[240px] rounded-xl border p-3.5 text-left relative cursor-pointer select-none overflow-hidden backdrop-blur-md transition-all duration-200 active:scale-[0.99] touch-manipulation group',
        getContainerStyle()
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        {getNodeTypeBadge()}
        {getStatusDisplay()}
      </div>

      {/* Node Name */}
      <div className="mb-1">
        <h4 className="text-xs font-semibold text-gray-900 tracking-tight line-clamp-1 group-hover:text-blue-500 transition-colors">
          {node.name}
        </h4>
        <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed mt-0.5">
          {node.description}
        </p>
      </div>

      {/* Footer Service & Action Info */}
      <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="text-xs">{serviceInfo.icon}</span>
          <span className={cn('font-mono font-medium text-[10px]', serviceInfo.color)}>
            {node.service}
          </span>
        </div>
        <span className="font-mono text-[10px] text-gray-600 truncate max-w-[90px]">
          {node.action}
        </span>
      </div>

      {/* Approval Role Callout if applicable */}
      {node.type === 'HUMAN_APPROVAL' && node.approvalConfig && (
        <div className="mt-2 text-[10px] font-mono text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded">
          Required: <span className="font-bold text-amber-200">{node.approvalConfig.approverRole}</span>
        </div>
      )}
    </div>
  );
};
