'use client';

import React from 'react';
import { AIIntentAnalysis } from '@/types/workflow';
import { Sparkles, Clock, AlertTriangle, Play } from 'lucide-react';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnalysisInspectorProps {
  analysis: AIIntentAnalysis;
  onLaunch: () => void;
  isLaunching?: boolean;
}

export const AnalysisInspector: React.FC<AnalysisInspectorProps> = ({
  analysis,
  onLaunch,
  isLaunching,
}) => {
  const getUrgencyBadge = (): BadgeProps['variant'] => {
    switch (analysis.urgency) {
      case 'CRITICAL':
        return 'danger';
      case 'HIGH':
        return 'warning';
      case 'MEDIUM':
        return 'primary';
      default:
        return 'neutral';
    }
  };

  const getRiskBadge = (): BadgeProps['variant'] => {
    switch (analysis.riskEvaluation.level) {
      case 'CRITICAL':
      case 'HIGH':
        return 'danger';
      case 'MEDIUM':
        return 'warning';
      default:
        return 'success';
    }
  };

  return (
    <div className="bg-gray-50/90 border border-gray-200 rounded-2xl p-6 shadow-2xl space-y-6 text-gray-900">
      {/* Top Banner: Intent & Confidence Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900 tracking-tight">
                AI Intent Classification & DAG Synthesis
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-600/10 text-blue-600 border border-blue-500/20 font-semibold">
                Gemini 3.6 Flash
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">
              Request ID: <span className="font-mono text-gray-700">{analysis.requestId}</span>
            </p>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="flex items-center gap-3 bg-white/80 px-3.5 py-2 rounded-xl border border-gray-200">
          <div className="text-right">
            <span className="text-[10px] font-mono text-gray-600 uppercase block">Confidence</span>
            <span className="text-sm font-bold font-mono text-emerald-400">
              {Math.round(analysis.confidenceScore * 100)}%
            </span>
          </div>
          <div className="w-12 bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full"
              style={{ width: `${Math.round(analysis.confidenceScore * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="p-4 rounded-xl bg-white/60 border border-gray-200/80">
        <span className="text-[11px] font-mono uppercase text-gray-600 tracking-wider font-semibold block mb-1">
          Executive Summary
        </span>
        <p className="text-sm text-gray-800 leading-relaxed font-medium">{analysis.summary}</p>
        <p className="text-xs text-gray-600 mt-2 italic font-mono">{analysis.rationale}</p>
      </div>

      {/* Key Metrics Grid: Urgency, SLA, Risk, Human Gate */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white/80 border border-gray-200">
          <span className="text-[10px] font-mono text-gray-600 uppercase block mb-1">Urgency</span>
          <Badge variant={getUrgencyBadge()} size="sm">
            {analysis.urgency}
          </Badge>
        </div>

        <div className="p-3.5 rounded-xl bg-white/80 border border-gray-200">
          <span className="text-[10px] font-mono text-gray-600 uppercase block mb-1">Target SLA</span>
          <div className="flex items-center gap-1.5 text-xs font-mono text-gray-800 font-semibold">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{analysis.estimatedSlaMinutes} min</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/80 border border-gray-200">
          <span className="text-[10px] font-mono text-gray-600 uppercase block mb-1">Risk Level</span>
          <Badge variant={getRiskBadge()} size="sm">
            {analysis.riskEvaluation.level}
          </Badge>
        </div>

        <div className="p-3.5 rounded-xl bg-white/80 border border-gray-200">
          <span className="text-[10px] font-mono text-gray-600 uppercase block mb-1">Human Gate</span>
          <Badge variant={analysis.riskEvaluation.requiresHumanApproval ? 'warning' : 'neutral'} size="sm">
            {analysis.riskEvaluation.requiresHumanApproval ? 'REQUIRED' : 'AUTONOMOUS'}
          </Badge>
        </div>
      </div>

      {/* Policy Trigger Banner if HITL is required */}
      {analysis.riskEvaluation.policyTrigger && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-semibold block">
              Automated Governance Compliance Trigger
            </span>
            <p className="text-xs text-amber-200 mt-0.5">{analysis.riskEvaluation.policyTrigger}</p>
          </div>
        </div>
      )}

      {/* Extracted Entities Table */}
      <div>
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider font-mono block mb-2">
          Structured Entity Extraction
        </span>
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white/80">
          <table className="w-full min-w-[32rem] text-left text-xs">
            <tbody>
              {Object.entries(analysis.extractedEntities || {}).map(([key, value], idx) => (
                <tr
                  key={key}
                  className={cn(
                    'border-b border-gray-200/60 last:border-0',
                    idx % 2 === 0 ? 'bg-white/40' : 'bg-gray-50/30'
                  )}
                >
                  <td className="px-4 py-2.5 font-mono text-gray-600 font-medium w-1/3">
                    {key}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-blue-500 font-semibold">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Workflow Mapping & Launch Trigger */}
      <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-gray-600 uppercase block">
            Mapped Deterministic Workflow:
          </span>
          <span className="text-xs font-mono font-bold text-gray-900">
            {analysis.recommendedWorkflowTitle} ({analysis.recommendedWorkflowId})
          </span>
        </div>

        <Button
          onClick={onLaunch}
          disabled={isLaunching}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-slate-950 font-bold gap-2 shadow-lg shadow-blue-500/20 px-6"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Launch Orchestration Pipeline</span>
        </Button>
      </div>
    </div>
  );
};
