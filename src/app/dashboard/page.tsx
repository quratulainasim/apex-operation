'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricsBar } from '@/components/dashboard/metrics-bar';
import { LiveFeed } from '@/components/dashboard/live-feed';
import { HealthGrid } from '@/components/dashboard/health-grid';
import { ActivityStream } from '@/components/dashboard/activity-stream';
import { useWorkflowStore } from '@/lib/store/use-workflow-store';
import { INSTANT_PROMPT_PRESETS } from '@/lib/presets/scenarios';
import { useRouter } from 'next/navigation';

export default function CommandCenterPage() {
  const router = useRouter();
  const loadPresetScenario = useWorkflowStore((s) => s.loadPresetScenario);

  const handleRunPreset = async (index: number) => {
    const id = await loadPresetScenario(index);
    router.push(`/workflows/${id}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="relative rounded-2xl bg-gradient-to-r from-[#F9F8F6] via-[#EFE9E3] to-[#D9CFC7] border border-[#C9B59C]/30 p-6 shadow-2xl overflow-hidden ring-1 ring-[#C9B59C]/20">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-600/10 text-blue-500 border border-blue-500/30 font-bold">
                Deterministic Enterprise FSM
              </span>
              <span className="text-[10px] font-mono text-gray-600">
                AI Structured Intake • Immutable SOC2 Audit
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Operational Command Center
            </h1>

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Orchestrating cross-functional workflows across Salesforce, SAP S/4HANA, Jira, Stripe,
              and AWS with human governance gates and automated compensation rollbacks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/intake">
              <Button className="bg-blue-600 hover:bg-blue-500 text-slate-950 font-bold gap-2 shadow-lg shadow-blue-500/20">
                <Sparkles className="w-4 h-4" />
                <span>AI Request Studio</span>
              </Button>
            </Link>

            <Link href="/workflows">
              <Button
                variant="outline"
                className="border-gray-300 bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900 gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>Workflow Catalog</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <MetricsBar />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LiveFeed />
          <HealthGrid />
        </div>

        <div className="space-y-6">
          <ActivityStream />

          <div className="bg-gray-50/80 border border-gray-200/90 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200/80">
              <span className="text-xs font-bold text-gray-900 uppercase font-mono tracking-wider">
                Instant Presets (1-Click)
              </span>
              <span className="text-[10px] font-mono text-blue-600">Exhibition Mode</span>
            </div>

            <div className="space-y-2">
              {INSTANT_PROMPT_PRESETS.slice(0, 3).map((preset, idx) => (
                <button
                  key={preset.id}
                  onClick={() => handleRunPreset(idx)}
                  className="w-full text-left p-2.5 rounded-xl bg-white/60 border border-gray-200/80 hover:border-blue-500/40 hover:bg-gray-100/40 transition-all group flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono uppercase text-gray-600 block mb-0.5">
                      {preset.tag} • {preset.urgency}
                    </span>
                    <span className="text-xs font-semibold text-gray-800 group-hover:text-gray-900 truncate block">
                      {preset.label}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-blue-600 flex-shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
