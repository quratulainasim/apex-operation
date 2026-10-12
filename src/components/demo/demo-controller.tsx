'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Gauge,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Layers,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkflowStore } from '@/lib/store/use-workflow-store';
import { INSTANT_PROMPT_PRESETS } from '@/lib/presets/scenarios';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const DemoController: React.FC = () => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);
  const [activePresetIndex, setActivePresetIndex] = useState(0);

  const {
    isPlaying,
    playbackSpeed,
    isExecutingStep,
    activeInstanceId,
    instances,
    startAutoPlay,
    pauseAutoPlay,
    stepWorkflow,
    resetInstance,
    setPlaybackSpeed,
    loadPresetScenario,
  } = useWorkflowStore();

  const activeInstance = instances.find((i) => i.id === activeInstanceId);

  const handleTogglePlay = () => {
    if (isPlaying) {
      pauseAutoPlay();
      toast.info('Simulation paused.');
    } else {
      if (activeInstanceId) {
        startAutoPlay(activeInstanceId);
        toast.success(`Simulation running at ${playbackSpeed}x speed.`);
      }
    }
  };

  const handleStepForward = async () => {
    if (!activeInstanceId) return;
    await stepWorkflow(activeInstanceId);
  };

  const handleReset = () => {
    if (activeInstanceId) {
      resetInstance(activeInstanceId);
      toast.info('Workflow reset to initial queued state.');
    }
  };

  const handleSelectPreset = async (index: number) => {
    setActivePresetIndex(index);
    const newId = await loadPresetScenario(index);
    toast.success(`Loaded scenario: ${INSTANT_PROMPT_PRESETS[index].label}`);
    router.push(`/workflows/${newId}`);
  };

  const speeds = [
    { label: '0.5x', value: 0.5 },
    { label: '1x', value: 1 },
    { label: '3x', value: 3 },
    { label: '10x', value: 10 },
  ];

  return (
    <div className="fixed bottom-[calc(0.5rem+var(--safe-area-bottom))] left-1/2 z-40 w-[96%] max-w-4xl -translate-x-1/2 transition-all duration-300 sm:bottom-5 sm:w-auto">
      <div className="rounded-2xl border border-gray-300/80 bg-gray-50/95 p-2.5 text-gray-800 shadow-2xl shadow-black/80 ring-1 ring-cyan-500/20 backdrop-blur-xl sm:p-3">
        {/* Top Header Bar inside Dock */}
        <div className="flex items-center justify-between gap-3 pb-2 mb-2 border-b border-gray-200/80">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider font-mono">
              Executive Demo Mode
            </span>
            {activeInstance && (
              <span className="text-[11px] font-mono text-blue-600 bg-blue-600/10 px-2 py-0.5 rounded border border-blue-500/20 truncate max-w-[200px]">
                {activeInstance.id}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex h-10 w-10 items-center justify-center rounded text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800 sm:h-8 sm:w-8"
              title={isExpanded ? 'Minimize Presets' : 'Expand Presets'}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 5 Instant Enterprise Preset Buttons (Collapsible) */}
        {isExpanded && (
          <div className="mb-2.5 flex snap-x snap-mandatory gap-1.5 overflow-x-auto pt-0.5 sm:grid sm:grid-cols-5 sm:overflow-visible">
            {INSTANT_PROMPT_PRESETS.map((preset, idx) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(idx)}
                className={cn(
                  'min-w-[11rem] snap-start rounded-lg border px-2.5 py-2 text-left text-[11px] font-medium transition-all flex flex-col justify-between truncate group sm:min-w-0 sm:py-1.5',
                  activePresetIndex === idx
                    ? 'bg-blue-600/15 border-blue-500/40 text-cyan-200 shadow-sm'
                    : 'bg-white/60 border-gray-200/80 text-gray-600 hover:text-gray-800 hover:bg-gray-100/60'
                )}
              >
                <div className="flex items-center justify-between w-full mb-0.5">
                  <span className="text-[9px] font-mono text-gray-600 uppercase">{preset.tag}</span>
                  <span
                    className={cn(
                      'text-[9px] font-mono px-1 rounded',
                      preset.urgency === 'CRITICAL'
                        ? 'text-rose-400 bg-rose-500/10'
                        : preset.urgency === 'HIGH'
                        ? 'text-amber-400 bg-amber-500/10'
                        : 'text-blue-400 bg-blue-500/10'
                    )}
                  >
                    {preset.urgency}
                  </span>
                </div>
                <span className="truncate w-full font-semibold text-[11px] text-gray-800 group-hover:text-gray-900">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Playback Controls & Speed Toggle Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Main Transport Buttons */}
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              onClick={handleTogglePlay}
              className={cn(
                'gap-1.5 font-semibold text-xs transition-all shadow-md',
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold'
                  : 'bg-blue-600 hover:bg-blue-500 text-slate-950 font-bold'
              )}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Auto-Run</span>
                </>
              )}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleStepForward}
              disabled={isExecutingStep || isPlaying}
              className="border-gray-300 bg-gray-100/80 text-gray-800 hover:bg-gray-200 hover:text-gray-900 gap-1 text-xs"
              title="Execute Next Step (Step >>)"
            >
              <SkipForward className="w-3.5 h-3.5 text-blue-600" />
              <span>Step Next</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              className="border-gray-300 bg-gray-100/80 text-gray-600 hover:text-gray-800 hover:bg-gray-200 gap-1 text-xs"
              title="Reset Workflow State"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-white/80 border border-gray-200 rounded-lg p-0.5">
            <span className="text-[10px] font-mono text-gray-600 px-1.5 flex items-center gap-1">
              <Gauge className="w-3 h-3 text-blue-600" /> Speed:
            </span>
            {speeds.map((s) => (
              <button
                key={s.value}
                onClick={() => setPlaybackSpeed(s.value)}
                className={cn(
                  'min-h-9 min-w-9 rounded px-2 py-1 text-xs font-mono transition-colors',
                  playbackSpeed === s.value
                    ? 'bg-blue-600/20 text-blue-500 font-semibold border border-blue-500/30'
                    : 'text-gray-600 hover:text-gray-800'
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
