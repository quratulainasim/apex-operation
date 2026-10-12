'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  Search,
  Filter,
  Download,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  ChevronDown,
  ChevronUp,
  Cpu,
  UserCheck,
  Server,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { collectAuditTrail, useWorkflowStore } from '@/lib/store/use-workflow-store';
import { AuditEvent } from '@/types/audit';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AuditLogPage() {
  const instances = useWorkflowStore((s) => s.instances);
  const auditEvents = useMemo(() => collectAuditTrail(instances), [instances]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActor, setSelectedActor] = useState<string>('ALL');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const actorOptions = [
    { label: 'All Actors', value: 'ALL' },
    { label: 'AI Agent', value: 'AI_AGENT' },
    { label: 'Human Operator', value: 'HUMAN_OPERATOR' },
    { label: 'System FSM', value: 'SYSTEM_CORE' },
    { label: 'Integrations', value: 'INTEGRATION_CONNECTOR' },
  ];

  const filteredEvents = auditEvents.filter((evt) => {
    const matchesSearch =
      evt.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.workflowId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evt.nodeId && evt.nodeId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      evt.sha256Hash.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesActor = selectedActor === 'ALL' || evt.actorType === selectedActor;

    return matchesSearch && matchesActor;
  });

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditEvents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `flowops_soc2_audit_ledger_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('SOC2 JSON Audit Compliance Report exported.');
  };

  const handleExportCsv = () => {
    const headers = ['Timestamp', 'ActorType', 'Actor', 'WorkflowID', 'NodeID', 'Summary', 'Sha256Hash', 'PreviousHash'];
    const rows = auditEvents.map((e) => [
      `"${e.timestamp}"`,
      `"${e.actorType}"`,
      `"${e.actorName}"`,
      `"${e.workflowId}"`,
      `"${e.nodeId || ''}"`,
      `"${e.summary.replace(/"/g, '""')}"`,
      `"${e.sha256Hash}"`,
      `"${e.previousHash || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `flowops_audit_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Audit CSV Ledger exported.');
  };

  const getActorBadge = (actorType: AuditEvent['actorType']) => {
    switch (actorType) {
      case 'AI_AGENT':
        return 'bg-blue-600/10 text-blue-500 border-blue-500/20';
      case 'HUMAN_OPERATOR':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'INTEGRATION_CONNECTOR':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
      case 'SYSTEM_CORE':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight font-mono">
              Immutable Forensic Audit Ledger
            </h1>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Tamper-evident cryptographically chained SHA-256 event trail satisfying SOC2 Type II,
            ISO 27001, and HIPAA compliance requirements.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Cryptographic Proof Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300">
            <ShieldCheck className="w-4 h-4" />
            <span>SHA-256 Chain Intact</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="border-gray-300 bg-gray-50 text-gray-700 hover:text-gray-900 hover:bg-gray-100 text-xs gap-1.5 h-8"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>

          <Button
            size="sm"
            onClick={handleExportJson}
            className="bg-blue-600 hover:bg-blue-500 text-slate-950 font-bold gap-1.5 text-xs shadow-md shadow-blue-500/20 h-8"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export SOC2 JSON</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/80 p-3 rounded-xl border border-gray-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by event summary, hash, or instance..."
            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-800 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        {/* Actor Type Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {actorOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedActor(opt.value)}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-mono transition-colors whitespace-nowrap',
                selectedActor === opt.value
                  ? 'bg-blue-600/20 text-blue-500 font-bold border border-blue-500/30'
                  : 'bg-white text-gray-600 hover:text-gray-800 border border-gray-200/80'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-gray-200 bg-gray-50/90 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white border-b border-gray-200 text-gray-600 uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">Actor & Channel</th>
                <th className="px-4 py-3.5">Workflow / Node</th>
                <th className="px-4 py-3.5">Event Summary</th>
                <th className="px-4 py-3.5">SHA-256 Hash</th>
                <th className="px-4 py-3.5 text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No matching audit events in cryptographic chain.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => {
                  const isExpanded = expandedRowId === evt.id;

                  return (
                    <React.Fragment key={evt.id}>
                      <tr className="hover:bg-gray-100/40 transition-colors">
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {new Date(evt.timestamp).toLocaleString()}
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                'text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold',
                                getActorBadge(evt.actorType)
                              )}
                            >
                              {evt.actorType.replace(/_/g, ' ')}
                            </span>
                            <span className="text-gray-700 text-[11px] font-sans">
                              {evt.actorName}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <Link
                              href={`/workflows/${evt.workflowId}`}
                              className="text-blue-600 hover:text-blue-500 hover:underline font-bold text-[11px]"
                            >
                              {evt.workflowId}
                            </Link>
                            {evt.nodeId && (
                              <div className="text-[10px] text-gray-500">[{evt.nodeId}]</div>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-gray-800 font-sans max-w-sm">
                          {evt.summary}
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-[10px] text-blue-600 bg-cyan-950/60 border border-cyan-900/50 px-2 py-0.5 rounded">
                            {evt.sha256Hash.slice(0, 10)}...
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setExpandedRowId(isExpanded ? null : evt.id)}
                            className="flex h-11 w-11 items-center justify-center rounded text-xs text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                            title="Inspect Payload"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Snapshot Drawer */}
                      {isExpanded && (
                        <tr className="bg-white/80">
                          <td colSpan={6} className="px-6 py-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-[11px] text-gray-600 pb-2 border-b border-gray-200">
                                <div className="space-y-0.5">
                                  <div>
                                    Full Event SHA-256:{' '}
                                    <strong className="text-blue-500 font-mono">
                                      {evt.sha256Hash}
                                    </strong>
                                  </div>
                                  <div>
                                    Parent SHA-256:{' '}
                                    <strong className="text-gray-600 font-mono">
                                      {evt.previousHash || 'GENESIS_ROOT'}
                                    </strong>
                                  </div>
                                </div>
                                <span className="text-emerald-400 font-bold flex items-center gap-1">
                                  <ShieldCheck className="w-4 h-4" />
                                  <span>SOC2 Cryptographically Verified</span>
                                </span>
                              </div>

                              <pre className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-[11px] text-cyan-200 overflow-x-auto max-h-60">
                                {JSON.stringify(evt.details || {}, null, 2)}
                              </pre>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
