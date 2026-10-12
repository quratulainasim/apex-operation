'use client';

import React, { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Send,
  Sliders,
  FileJson,
  Layers,
  ArrowRight,
  ShieldAlert,
  Zap,
  RefreshCw,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnalysisInspector } from '@/components/intake/analysis-inspector';
import { INSTANT_PROMPT_PRESETS } from '@/lib/presets/scenarios';
import { useWorkflowStore } from '@/lib/store/use-workflow-store';
import { AIIntentAnalysis } from '@/types/workflow';
import { toast } from 'sonner';

export default function RequestIntakePage() {
  const router = useRouter();
  const launchFromAIAnalysis = useWorkflowStore((s) => s.launchFromAIAnalysis);
  const loadPresetScenario = useWorkflowStore((s) => s.loadPresetScenario);

  const [promptText, setPromptText] = useState(
    'URGENT: Acme Global ($420k ARR, Enterprise Platinum tier) experienced a critical 4.2h production outage due to US-East cluster disruption. VP Johnathan Miller is requesting a 25% SLA breach service credit of $15,000 USD on Stripe, plus an urgent Jira escalation to DevOps with Slack leadership notification.'
  );
  const [sourceChannel, setSourceChannel] = useState<'SLACK' | 'EMAIL' | 'SERVICENOW' | 'EXECUTIVE_WEBHOOK'>('SLACK');
  const [urgencyOverride, setUrgencyOverride] = useState<'AUTO' | 'HIGH' | 'CRITICAL'>('AUTO');
  const [rawContextJson, setRawContextJson] = useState('');
  const [showJsonDrawer, setShowJsonDrawer] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIIntentAnalysis | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);

  // Handle Preset prompt insertion
  const handleSelectPreset = (index: number) => {
    const preset = INSTANT_PROMPT_PRESETS[index];
    setPromptText(preset.prompt);
    toast.info(`Loaded scenario prompt: ${preset.label}`);
  };

  // Submit to AI Analysis Engine (/api/ai/analyze)
  const handleAnalyzeRequest = async () => {
    if (!promptText.trim()) {
      toast.error('Please enter a business request to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      let customContext = {};
      if (rawContextJson.trim()) {
        try {
          customContext = JSON.parse(rawContextJson);
        } catch {
          toast.warning('Invalid JSON context syntax, proceeding with plain prompt text.');
        }
      }

      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          context: {
            channel: sourceChannel,
            urgencyOverride: urgencyOverride !== 'AUTO' ? urgencyOverride : undefined,
            ...customContext,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze request');
      }

      setAnalysisResult(data.data);
      toast.success(
        `AI Classification Complete: ${data.data.recommendedWorkflowTitle} (${data.source === 'GEMINI_3_6_FLASH' ? 'Gemini 3.6 Flash' : 'Deterministic Semantic Matcher'})`
      );
    } catch (err) {
      toast.error(`Analysis failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Launch pipeline from structured AI plan
  const handleLaunchPipeline = async () => {
    if (!analysisResult) return;
    setIsLaunching(true);
    try {
      const newInstanceId = launchFromAIAnalysis(analysisResult);
      toast.success(`Orchestration instance ${newInstanceId} initialized & queued.`);
      router.push(`/workflows/${newInstanceId}`);
    } catch (err) {
      toast.error(`Failed to launch workflow: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight font-mono">
              AI Request Intake Studio
            </h1>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Transform natural language business tickets, Slack alerts, or emails into deterministic
            executable DAGs with automated policy extraction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-gray-50 border border-gray-200 text-gray-700">
            Model: <strong className="text-blue-600">Gemini 3.6 Flash</strong> / Offline Fallback
          </span>
        </div>
      </div>

      {/* Preset Chips Carousel */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase text-gray-600 font-semibold tracking-wider block">
          Select Instant Enterprise Prompt Preset:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {INSTANT_PROMPT_PRESETS.map((preset, idx) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(idx)}
              className="p-2.5 rounded-xl bg-gray-50/90 border border-gray-200/80 hover:border-blue-500/40 hover:bg-gray-100/50 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="text-blue-600 uppercase font-bold">{preset.tag}</span>
                <span className="text-gray-500 font-medium">{preset.urgency}</span>
              </div>
              <p className="text-xs font-semibold text-gray-800 group-hover:text-gray-900 truncate">
                {preset.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form */}
      <div className="bg-gray-50/90 border border-gray-200 rounded-2xl p-5 shadow-2xl space-y-4">
        {/* Source and Urgency Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-200/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-gray-600">Source Intake Channel:</span>
            <select
              value={sourceChannel}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSourceChannel(e.target.value as typeof sourceChannel)}
              className="bg-white border border-gray-300 text-xs font-mono text-gray-800 px-2.5 py-1 rounded-lg focus:outline-none focus:border-cyan-400"
            >
              <option value="SLACK">Slack Grid Channel (#ops-escalations)</option>
              <option value="EMAIL">Enterprise Email (exec-dispatch@company.com)</option>
              <option value="SERVICENOW">ServiceNow Incident Bridge</option>
              <option value="EXECUTIVE_WEBHOOK">Direct REST API / Webhook</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowJsonDrawer(!showJsonDrawer)}
              className="text-xs font-mono text-gray-600 hover:text-gray-800 flex items-center gap-1 hover:underline"
            >
              <FileJson className="w-3.5 h-3.5 text-blue-600" />
              <span>{showJsonDrawer ? 'Hide Context JSON' : 'Attach Context JSON'}</span>
            </button>
          </div>
        </div>

        {/* JSON Payload Attachment (Collapsible) */}
        {showJsonDrawer && (
          <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1.5">
            <label className="text-[10px] font-mono text-gray-600 uppercase">
              Raw Context JSON (Optional Metadata):
            </label>
            <textarea
              rows={3}
              value={rawContextJson}
              onChange={(e) => setRawContextJson(e.target.value)}
              placeholder='{"accountTier": "ENTERPRISE_PLATINUM", "revenueImpact": 15000}'
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-mono text-blue-500 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>
        )}

        {/* Prompt Input Textarea */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-gray-700 flex items-center justify-between">
            <span>Natural Language Business Intent Prompt:</span>
            <span className="text-[10px] text-gray-500">{promptText.length} characters</span>
          </label>
          <textarea
            rows={5}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Type or paste unstructured email, ticket, or natural language command..."
            className="w-full bg-white/90 border border-gray-300/80 rounded-xl p-4 text-xs sm:text-sm font-sans text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/20 leading-relaxed resize-none"
          />
        </div>

        {/* Dispatch Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-[11px] text-gray-600 font-mono">
            Zero-risk simulation: AI structures intent; deterministic FSM guarantees safety.
          </p>

          <Button
            onClick={handleAnalyzeRequest}
            disabled={isAnalyzing || !promptText.trim()}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-slate-950 font-bold gap-2 px-6 shadow-lg shadow-blue-500/20 h-10"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing DAG & Classifying...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Classify & Synthesize DAG</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Screen 3: AI Request Analysis Inspector */}
      {analysisResult && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <AnalysisInspector
            analysis={analysisResult}
            onLaunch={handleLaunchPipeline}
            isLaunching={isLaunching}
          />
        </div>
      )}
    </div>
  );
}
