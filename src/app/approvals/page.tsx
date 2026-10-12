'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  Clock,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkflowStore } from '@/lib/store/use-workflow-store';
import { formatCurrency, cn } from '@/lib/utils';
import { isWorkflowWaitingApproval } from '@/types/workflow';
import { toast } from 'sonner';

export default function ApprovalsPage() {
  const {
    instances,
    setActiveInstance,
    setIsApprovalDrawerOpen,
    handleApprovalDecision,
  } = useWorkflowStore();

  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Filter instances that are waiting for human approval
  const pendingInstances = instances.filter(isWorkflowWaitingApproval);

  // Filter resolved instances for governance compliance history
  const resolvedInstances = instances.filter(
    (i) => i.status === 'SUCCESS' || i.status === 'FAILED'
  );

  const handleOpenApprovalModal = (instanceId: string) => {
    setActiveInstance(instanceId);
    setIsApprovalDrawerOpen(true);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight font-mono">
              Human Governance & Policy Authorization
            </h1>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Deterministic execution halts automatically when governance rules or financial impact
            thresholds are exceeded (SOC2 / ISO 27001 compliant).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold animate-pulse">
            {pendingInstances.length} Awaiting Authorization
          </span>
        </div>
      </div>

      {/* Pending Approvals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 uppercase font-mono tracking-wider">
            Active Approval Queue ({pendingInstances.length})
          </h2>
        </div>

        {pendingInstances.length === 0 ? (
          <div className="p-8 rounded-2xl bg-gray-50/60 border border-gray-200/80 text-center space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-gray-900">Governance Queue Cleared</h3>
            <p className="text-xs text-gray-600 max-w-md mx-auto">
              All automated pipelines are operating within autonomous policy thresholds. High-risk
              operations will appear here for cryptographic sign-off.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingInstances.map((instance) => {
              const approval = instance.approvalRequest;
              const approvalNode = instance.nodes.find((n) => n.status === 'WAITING_APPROVAL');

              return (
                <div
                  key={instance.id}
                  className="p-5 rounded-2xl bg-gray-50/90 border border-amber-500/40 shadow-2xl ring-1 ring-amber-500/20 space-y-4"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-gray-900">{instance.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                          {instance.id}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{instance.description}</p>
                    </div>

                    <Button
                      onClick={() => handleOpenApprovalModal(instance.id)}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold gap-2 text-xs shadow-lg shadow-amber-500/20 h-9 self-start sm:self-center"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Review & Authorize</span>
                    </Button>
                  </div>

                  {/* Policy Violation Banner */}
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-mono text-amber-300 font-bold block uppercase tracking-wider">
                        Automated Compliance Policy Trigger:
                      </span>
                      <p className="text-amber-200 mt-0.5">
                        {approval?.policyTrigger ||
                          approval?.reason ||
                          'Financial transaction or IAM security mutation exceeds autonomous policy threshold.'}
                      </p>
                    </div>
                  </div>

                  {/* Metadata and Diff summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-white border border-gray-200">
                      <span className="text-[10px] text-gray-500 uppercase block mb-1">
                        Signing Role:
                      </span>
                      <span className="text-blue-600 font-bold">
                        {approval?.approverRole || approvalNode?.approvalConfig?.approverRole || 'VP_SUPPORT'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-gray-200">
                      <span className="text-[10px] text-gray-500 uppercase block mb-1">
                        Financial Impact:
                      </span>
                      <span className="text-amber-300 font-bold">
                        {approval?.financialImpactUsd
                          ? formatCurrency(approval.financialImpactUsd)
                          : 'High Impact Action'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-gray-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase block mb-1">
                          Pipeline Canvas:
                        </span>
                        <Link
                          href={`/workflows/${instance.id}`}
                          className="text-blue-600 hover:text-blue-500 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span>Inspect Node Graph</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Audit History of Executed Governance Decisions */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <h2 className="text-sm font-bold text-gray-700 uppercase font-mono tracking-wider">
          Recent Governance Decision Audit Trail
        </h2>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-50/80">
          <table className="w-full min-w-[38rem] text-left text-xs font-mono">
            <thead className="bg-white border-b border-gray-200 text-gray-600 uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Workflow ID</th>
                <th className="px-4 py-3">Policy Rule</th>
                <th className="px-4 py-3">Decided By</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {resolvedInstances.slice(0, 5).map((inst) => (
                <tr key={inst.id} className="hover:bg-gray-100/40">
                  <td className="px-4 py-3 text-blue-600 font-semibold">{inst.id}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{inst.title}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {inst.approvalRequest?.decidedBy || 'VP_SUPPORT'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'text-[10px] px-2 py-0.5 rounded border uppercase font-bold',
                        inst.status === 'SUCCESS'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                      )}
                    >
                      {inst.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
