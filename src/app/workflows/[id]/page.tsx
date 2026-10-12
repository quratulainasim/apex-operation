'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Layers,
  Terminal,
  FileJson,
  Sparkles,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkflowCanvas } from '@/components/canvas/workflow-canvas';
import { PayloadInspector } from '@/components/execution/payload-inspector';
import { LogTerminal } from '@/components/execution/log-terminal';
import { useWorkflowStore } from '@/lib/store/use-workflow-store';
import { cn } from '@/lib/utils';
import { isWorkflowWaitingApproval } from '@/types/workflow';
import { toast } from 'sonner';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function WorkflowExecutionPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const instanceId = resolvedParams.id;

  const {
    instances,
    activeInstanceId,
    setActiveInstance,
    selectedNodeId,
    setSelectedNode,
    isPlaying,
    isExecutingStep,
    startAutoPlay,
    pauseAutoPlay,
    stepWorkflow,
    resetInstance,
    setIsApprovalDrawerOpen,
  } = useWorkflowStore();

  const [activeTab, setActiveTab] = useState<'PAYLOAD' | 'LOGS' | 'VARIABLES'>('PAYLOAD');

  // Set active instance on mount
  useEffect(() => {
    if (instanceId && activeInstanceId !== instanceId) {
      setActiveInstance(instanceId);
    }
  }, [instanceId, activeInstanceId, setActiveInstance]);

  const instance = instances.find((i) => i.id === instanceId);
  const selectedNode = instance?.nodes.find((n) => n.id === selectedNodeId) || null;

  if (!instance) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-mono text-sm">
          Workflow instance <strong className="text-blue-600">{instanceId}</strong> not found or initialized.
        </div>
        <Link href="/dashboard">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Command Center</span>
          </Button>
        </Link>
      </div>
    );
  }

  const completedCount = instance.nodes.filter((n) => n.status === 'COMPLETED').length;
  const totalCount = instance.nodes.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isWaitingApproval = isWorkflowWaitingApproval(instance);

  const handleTogglePlay = () => {
    if (isPlaying) {
      pauseAutoPlay();
      toast.info('Workflow execution paused.');
    } else {
      startAutoPlay(instance.id);
      toast.success('Simulation running.');
    }
  };

  const handleStepForward = async () => {
    await stepWorkflow(instance.id);
  };

  const handleReset = () => {
    resetInstance(instance.id);
    toast.info('Workflow reset to initial ready state.');
  };

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col space-y-4 lg:h-[calc(100dvh-8.5rem)]">
      {/* Top Workflow Control Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50/90 border border-gray-200 shadow-xl flex-shrink-0">
        {/* Left: Metadata & Breadcrumb */}
        <div className="flex min-w-0 items-start gap-3">
          <Link href="/dashboard" className="shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 h-9 w-9"
              title="Back to Command Center"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="max-w-[calc(100vw-7rem)] truncate text-base font-bold tracking-tight text-gray-900 font-mono sm:max-w-xl">
                {instance.title}
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-blue-600 border border-gray-200 font-semibold">
                {instance.id}
              </span>
              <span
                className={cn(
                  'text-[10px] font-mono px-2 py-0.5 rounded border font-bold uppercase',
                  instance.status === 'SUCCESS'
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : isWaitingApproval
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 animate-pulse'
                    : instance.status === 'RUNNING'
                    ? 'bg-blue-600/15 text-blue-500 border-blue-500/30 animate-pulse'
                    : 'bg-gray-100 text-gray-600 border-gray-300'
                )}
              >
                {instance.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5 line-clamp-1 max-w-2xl">
              {instance.description}
            </p>
          </div>
        </div>

        {/* Right: Transport Controls */}
        <div className="flex w-full flex-wrap items-center justify-end gap-2 self-stretch overflow-x-auto pb-1 lg:w-auto lg:self-center">
          {isWaitingApproval && (
            <Button
              onClick={() => setIsApprovalDrawerOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold gap-1.5 shadow-lg shadow-amber-500/20 text-xs h-9 animate-pulse"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Human Authorization Gate</span>
            </Button>
          )}

          <Button
            size="sm"
            onClick={handleTogglePlay}
            disabled={instance.status === 'SUCCESS' || instance.status === 'FAILED'}
            className={cn(
              'gap-1.5 font-semibold text-xs h-9 shadow-md',
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold'
                : 'bg-blue-600 hover:bg-blue-500 text-slate-950 font-bold'
            )}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Run</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Auto-Play</span>
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleStepForward}
            disabled={
              isExecutingStep ||
              isPlaying ||
              instance.status === 'SUCCESS' ||
              instance.status === 'FAILED' ||
              instance.status === 'CANCELLED'
            }
            className="border-gray-300 bg-gray-100 text-gray-800 hover:text-gray-900 hover:bg-gray-200 text-xs h-9 gap-1"
          >
            <SkipForward className="w-3.5 h-3.5 text-blue-600" />
            <span>Step Next</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="border-gray-300 bg-gray-100 text-gray-600 hover:text-gray-800 hover:bg-gray-200 text-xs h-9 gap-1"
            title="Reset Workflow State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>
      </div>

      {/* Main Split Viewport */}
      <div className="grid min-h-0 flex-none grid-cols-1 gap-4 lg:flex-1 lg:grid-cols-12">
        {/* Left: Interactive SVG DAG Execution Canvas (65% / 8 Cols) */}
        <div className="h-[52dvh] min-h-[360px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl lg:col-span-7 lg:h-full lg:min-h-[420px] xl:col-span-8">
          <WorkflowCanvas
            instance={instance}
            selectedNodeId={selectedNodeId}
            onSelectNode={(node) => setSelectedNode(node ? node.id : null)}
          />
        </div>

        {/* Right: Live Execution Console Drawer (35% / 4 Cols) */}
        <div className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/90 shadow-2xl lg:col-span-5 lg:h-full xl:col-span-4">
          {/* Console Header Tabs */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white/60 flex-shrink-0">
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200 text-xs font-mono">
              <button
                onClick={() => setActiveTab('PAYLOAD')}
                className={cn(
                  'px-3 py-1 rounded transition-colors flex items-center gap-1.5',
                  activeTab === 'PAYLOAD'
                    ? 'bg-blue-600/20 text-blue-500 font-bold border border-blue-500/30'
                    : 'text-gray-600 hover:text-gray-800'
                )}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Payloads</span>
              </button>

              <button
                onClick={() => setActiveTab('LOGS')}
                className={cn(
                  'px-3 py-1 rounded transition-colors flex items-center gap-1.5',
                  activeTab === 'LOGS'
                    ? 'bg-blue-600/20 text-blue-500 font-bold border border-blue-500/30'
                    : 'text-gray-600 hover:text-gray-800'
                )}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Logs ({instance.logs?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('VARIABLES')}
                className={cn(
                  'px-3 py-1 rounded transition-colors flex items-center gap-1.5',
                  activeTab === 'VARIABLES'
                    ? 'bg-blue-600/20 text-blue-500 font-bold border border-blue-500/30'
                    : 'text-gray-600 hover:text-gray-800'
                )}
              >
                <FileJson className="w-3.5 h-3.5" />
                <span>State</span>
              </button>
            </div>

            <div className="text-[11px] font-mono text-gray-600">
              Step <strong className="text-gray-900">{completedCount}</strong>/{totalCount}
            </div>
          </div>

          {/* Tab Content Viewport */}
          <div className="p-4 flex-1 overflow-y-auto">
            {activeTab === 'PAYLOAD' && (
              <PayloadInspector instance={instance} selectedNode={selectedNode} />
            )}

            {activeTab === 'LOGS' && <LogTerminal instance={instance} />}

            {activeTab === 'VARIABLES' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-white/80 border border-gray-200 space-y-1.5">
                  <span className="text-[11px] font-semibold text-gray-600 uppercase block">
                    Initial Context Variables:
                  </span>
                  <pre className="p-2 rounded bg-gray-50/60 text-gray-700 text-[11px] overflow-x-auto">
                    {JSON.stringify(instance.context.variables, null, 2)}
                  </pre>
                </div>

                <div className="p-3.5 rounded-xl bg-white/80 border border-gray-200 space-y-1.5">
                  <span className="text-[11px] font-semibold text-blue-600 uppercase block">
                    Cumulative Step Outputs:
                  </span>
                  <pre className="p-2 rounded bg-gray-50/60 text-blue-500 text-[11px] overflow-x-auto">
                    {JSON.stringify(instance.context.stepOutputs, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
