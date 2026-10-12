'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  Lock,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWorkflowStore } from '@/lib/store/use-workflow-store';
import { formatCurrency, cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ApprovalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instanceId?: string;
}

export const ApprovalDrawer: React.FC<ApprovalDrawerProps> = ({
  isOpen,
  onClose,
  instanceId,
}) => {
  const [decisionNote, setDecisionNote] = useState('');
  const [selectedRole, setSelectedRole] = useState('VP_SUPPORT');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { instances, activeInstanceId, handleApprovalDecision } = useWorkflowStore();
  const currentInstanceId = instanceId || activeInstanceId;
  const instance = instances.find((i) => i.id === currentInstanceId);
  const approval = instance?.approvalRequest;

  if (!isOpen || !instance || !approval) return null;

  const handleDecision = async (decision: 'APPROVED' | 'REJECTED') => {
    if (!decisionNote.trim()) {
      toast.error('Executive decision note is required for audit compliance.');
      return;
    }

    setIsSubmitting(true);
    try {
      await handleApprovalDecision(
        instance.id,
        decision,
        decisionNote,
        selectedRole
      );
      if (decision === 'APPROVED') {
        toast.success(`Pipeline authorization GRANTED by ${selectedRole}. Resuming automated execution.`);
      } else {
        toast.error(`Pipeline authorization REJECTED by ${selectedRole}. Compensation rollback initiated.`);
      }
      onClose();
    } catch (e: any) {
      toast.error(`Error applying decision: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles = [
    { label: 'VP Support & Accounts', value: 'VP_SUPPORT' },
    { label: 'Chief Financial Officer (CFO)', value: 'CFO' },
    { label: 'Chief Info Security Officer (CISO)', value: 'CISO' },
    { label: 'DevOps Lead Engineer', value: 'DEVOPS_LEAD' },
    { label: 'Operations Director', value: 'OPERATIONS_MANAGER' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200 sm:items-center sm:p-4">
      <div className="relative flex max-h-[92dvh] w-full flex-col overflow-y-auto rounded-t-3xl border border-amber-500/40 bg-gray-50 p-4 pb-[calc(1rem+var(--safe-area-bottom))] text-gray-900 shadow-2xl shadow-amber-500/10 ring-1 ring-amber-500/30 sm:max-h-[90vh] sm:max-w-3xl sm:rounded-2xl sm:p-6 sm:pb-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md shadow-amber-500/20">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 tracking-tight">
                  Executive Human Governance Gate
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold animate-pulse">
                  ACTION REQUIRED
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                Workflow <span className="font-mono text-blue-600">{instance.id}</span> halted by automated policy rule
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 p-1 rounded-lg hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Policy Trigger Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold block">
              Governance Policy Violation Threshold
            </span>
            <p className="text-xs text-amber-200 font-medium mt-0.5 leading-relaxed">
              {approval.policyTrigger || approval.reason}
            </p>
          </div>
        </div>

        {/* Side-by-Side Payload Diff: Current vs Proposed */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current State */}
          <div className="p-4 rounded-xl bg-white/80 border border-gray-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-200/80">
              <span className="text-xs font-mono font-semibold text-gray-600 uppercase">
                1. Pre-Execution State
              </span>
              <span className="text-[10px] font-mono text-gray-600">Read-Only</span>
            </div>
            <pre className="text-[11px] font-mono text-gray-700 leading-relaxed overflow-x-auto p-2 bg-gray-50/50 rounded-lg">
              {JSON.stringify(
                approval.beforeState || {
                  status: 'PENDING_APPROVAL',
                  accountTier: instance.context.variables.accountTier || 'ENTERPRISE_PLATINUM',
                  customer: instance.context.variables.customerName || 'Acme Global',
                },
                null,
                2
              )}
            </pre>
          </div>

          {/* Proposed Mutation */}
          <div className="p-4 rounded-xl bg-white/80 border border-blue-500/30 ring-1 ring-cyan-500/20">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-blue-500/30">
              <span className="text-xs font-mono font-semibold text-blue-600 uppercase flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5" /> 2. Proposed Mutation
              </span>
              <span className="text-[10px] font-mono text-blue-500 font-bold">Pending Sign-Off</span>
            </div>
            <pre className="text-[11px] font-mono text-cyan-200 leading-relaxed overflow-x-auto p-2 bg-gray-50/50 rounded-lg">
              {JSON.stringify(
                approval.proposedState || {
                  authorizedAction: approval.action,
                  financialImpactUsd: approval.financialImpactUsd || 15000,
                  mutationStatus: 'AUTHORIZED_BY_EXECUTIVE',
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>

        {/* Approver Role & Decision Notes */}
        <div className="mt-5 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Signing Authority Role:</span>
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-white border border-gray-300 text-xs font-mono text-gray-800 px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-400"
            >
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1.5">
              Cryptographic Rationale & Audit Note (Mandatory for SOC2):
            </label>
            <textarea
              rows={2}
              value={decisionNote}
              onChange={(e) => setDecisionNote(e.target.value)}
              placeholder="e.g. Approved per Master Service Agreement SLA Clause 4.1 for 4.2h verified production disruption."
              className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs text-gray-800 placeholder:text-gray-600 focus:outline-none focus:border-amber-400 font-mono resize-none"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex flex-col-reverse justify-end gap-2.5 border-t border-gray-200 pt-4 sm:flex-row">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="min-h-11 w-full border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 sm:w-auto"
          >
            Cancel & Close
          </Button>

          <Button
            variant="outline"
            disabled={isSubmitting}
            onClick={() => handleDecision('REJECTED')}
            className="min-h-11 w-full gap-1.5 border-rose-500/50 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 sm:w-auto"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>Reject & Rollback</span>
          </Button>

          <Button
            disabled={isSubmitting}
            onClick={() => handleDecision('APPROVED')}
            className="min-h-11 w-full gap-1.5 bg-emerald-500 font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 sm:w-auto"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Approve & Resume Pipeline</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
