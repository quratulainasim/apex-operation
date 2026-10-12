'use client';

import React from 'react';
import {
  FileJson,
  Layers,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ExternalLink,
  Cpu,
} from 'lucide-react';
import { WorkflowNode, WorkflowInstance } from '@/types/workflow';
import { formatCurrency, cn } from '@/lib/utils';

interface PayloadInspectorProps {
  instance: WorkflowInstance;
  selectedNode: WorkflowNode | null;
}

export const PayloadInspector: React.FC<PayloadInspectorProps> = ({
  instance,
  selectedNode,
}) => {
  // If no node selected, find active or last completed node
  const activeNode =
    selectedNode ||
    instance.nodes.find((n) => n.status === 'RUNNING' || n.status === 'WAITING_APPROVAL') ||
    instance.nodes.filter((n) => n.status === 'COMPLETED').slice(-1)[0] ||
    instance.nodes[0];

  if (!activeNode) {
    return (
      <div className="p-6 text-center text-xs font-mono text-gray-500">
        No node selected in DAG execution canvas.
      </div>
    );
  }

  const stepOutput = instance.context.stepOutputs[activeNode.id];

  return (
    <div className="space-y-4 text-xs">
      {/* Node Summary Card */}
      <div className="p-3.5 rounded-xl bg-white/80 border border-gray-200">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-blue-600 font-bold text-xs truncate">
            {activeNode.id}
          </span>
          <span
            className={cn(
              'text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold',
              activeNode.status === 'COMPLETED'
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : activeNode.status === 'RUNNING'
                ? 'bg-blue-600/15 text-blue-500 border-blue-500/30 animate-pulse'
                : activeNode.status === 'WAITING_APPROVAL'
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 animate-pulse'
                : 'bg-gray-100 text-gray-600 border-gray-300'
            )}
          >
            {activeNode.status}
          </span>
        </div>
        <h4 className="text-gray-900 font-bold text-xs">{activeNode.name}</h4>
        <p className="text-gray-600 text-[11px] mt-0.5">{activeNode.description}</p>

        {activeNode.executionMetrics?.durationMs !== undefined && (
          <div className="mt-2 pt-2 border-t border-gray-200/80 flex items-center justify-between text-[10px] font-mono text-gray-600">
            <span>Execution Duration:</span>
            <span className="text-emerald-400 font-bold">{activeNode.executionMetrics.durationMs}ms</span>
          </div>
        )}
      </div>

      {/* Input Configuration & Parameters */}
      <div className="p-3.5 rounded-xl bg-white/80 border border-gray-200 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-gray-700 uppercase">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>1. Step Input Parameters</span>
          </span>
          <span className="text-[10px] text-gray-500 font-normal">Passed from FSM</span>
        </div>
        <pre className="p-2.5 rounded-lg bg-gray-50/80 border border-gray-200/80 font-mono text-[11px] text-gray-700 overflow-x-auto max-h-40">
          {JSON.stringify(activeNode.inputPayloadTemplate || {}, null, 2)}
        </pre>
      </div>

      {/* Output Mutation & Tool Response */}
      <div className="p-3.5 rounded-xl bg-white/80 border border-gray-200 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-blue-500 uppercase">
          <span className="flex items-center gap-1.5">
            <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
            <span>2. Integration Response Output</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-normal">
            {stepOutput ? 'Executed' : 'Pending Step Execution'}
          </span>
        </div>
        <pre className="p-2.5 rounded-lg bg-gray-50/80 border border-gray-200/80 font-mono text-[11px] text-blue-500 overflow-x-auto max-h-48">
          {stepOutput
            ? JSON.stringify(stepOutput, null, 2)
            : '// Step output payload will stream here upon node transition.'}
        </pre>
      </div>
    </div>
  );
};
