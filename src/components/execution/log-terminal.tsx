'use client';

import React, { useState } from 'react';
import {
  Terminal,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Download,
  Copy,
} from 'lucide-react';
import { WorkflowInstance } from '@/types/workflow';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LogTerminalProps {
  instance: WorkflowInstance;
}

export const LogTerminal: React.FC<LogTerminalProps> = ({ instance }) => {
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'EXEC' | 'WARN' | 'ERROR'>('ALL');
  const logs = instance.logs || [];

  const filteredLogs = logs.filter((log) => {
    if (filterLevel === 'ALL') return true;
    if (filterLevel === 'EXEC') return log.level === 'EXEC';
    if (filterLevel === 'WARN') return log.level === 'WARN';
    if (filterLevel === 'ERROR') return log.level === 'ERROR';
    return true;
  });

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'EXEC':
        return 'text-blue-600 bg-blue-600/10 border-blue-500/30';
      case 'WARN':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'ERROR':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const handleCopyLogs = () => {
    const text = logs
      .map((l) => `[${l.timestamp}] [${l.level}] [${l.nodeId || 'CORE'}] ${l.message}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Terminal stdout logs copied to clipboard.');
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      {/* Log Header Controls */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-[11px] font-bold text-gray-700 uppercase">
            Stdout / Execution Stream ({logs.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Level Filter Buttons */}
          <div className="flex items-center gap-1 bg-white p-0.5 rounded border border-gray-200 text-[10px]">
            {(['ALL', 'EXEC', 'WARN', 'ERROR'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={cn(
                  'min-h-9 min-w-9 rounded px-1.5 py-1 transition-colors',
                  filterLevel === lvl
                    ? 'bg-gray-100 text-gray-900 font-bold'
                    : 'text-gray-600 hover:text-gray-800'
                )}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyLogs}
            title="Copy Logs"
            className="flex h-10 w-10 items-center justify-center rounded text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div className="bg-white/90 rounded-xl p-3 border border-gray-200 font-mono text-[11px] space-y-2 max-h-80 overflow-y-auto leading-relaxed">
        {filteredLogs.length === 0 ? (
          <div className="text-gray-500 text-center py-6">
            // No execution logs recorded for this filter.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 text-gray-700">
              <span className="text-slate-600 text-[10px] select-none whitespace-nowrap">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span
                className={cn(
                  'text-[9px] px-1 py-0.2 rounded border font-bold uppercase select-none whitespace-nowrap',
                  getLevelBadge(log.level)
                )}
              >
                {log.level}
              </span>
              {log.nodeId && (
                <span className="text-gray-500 text-[10px] select-none whitespace-nowrap">
                  [{log.nodeId}]
                </span>
              )}
              <span className="text-gray-800 break-words flex-1">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
