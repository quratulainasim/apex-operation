'use client';

import React, { useRef, useState } from 'react';
import { WorkflowNode, WorkflowEdge, WorkflowInstance } from '@/types/workflow';
import { WorkflowNodeCard } from './workflow-node-card';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowCanvasProps {
  instance: WorkflowInstance;
  selectedNodeId?: string | null;
  onSelectNode?: (node: WorkflowNode | null) => void;
  className?: string;
}

const NODE_WIDTH = 240;
const NODE_HEIGHT = 140;

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  instance,
  selectedNodeId,
  onSelectNode,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Use pointer events so the same canvas gesture works with mouse, pen, and touch.
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('[role="button"]')) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = {
      x: event.clientX - pan.x,
      y: event.clientY - pan.y,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    setPan({
      x: event.clientX - dragStartRef.current.x,
      y: event.clientY - dragStartRef.current.y,
    });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
  };

  // Handle wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.max(0.4, Math.min(1.6, z + delta)));
  };

  const handleZoomIn = () => setZoom((z) => Math.min(1.6, z + 0.15));
  const handleZoomOut = () => setZoom((z) => Math.max(0.4, z - 0.15));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 40, y: 40 });
  };

  // Compute bounding canvas dimensions
  const maxX = Math.max(...instance.nodes.map((n) => n.position.x + NODE_WIDTH + 150), 1400);
  const maxY = Math.max(...instance.nodes.map((n) => n.position.y + NODE_HEIGHT + 150), 600);

  // Generate cubic Bezier path between two nodes
  const getEdgePath = (sourceNode: WorkflowNode, targetNode: WorkflowNode) => {
    const startX = sourceNode.position.x + NODE_WIDTH;
    const startY = sourceNode.position.y + NODE_HEIGHT / 2;
    const endX = targetNode.position.x;
    const endY = targetNode.position.y + NODE_HEIGHT / 2;

    const deltaX = Math.abs(endX - startX) * 0.55;
    const c1X = startX + deltaX;
    const c1Y = startY;
    const c2X = endX - deltaX;
    const c2Y = endY;

    return `M ${startX} ${startY} C ${c1X} ${c1Y}, ${c2X} ${c2Y}, ${endX} ${endY}`;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      className={cn(
        'relative h-full min-h-[360px] w-full touch-none overflow-hidden rounded-2xl border border-gray-200/60 bg-white select-none cursor-grab active:cursor-grabbing sm:min-h-[460px]',
        className
      )}
      style={{
        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }}
    >
      {/* Floating Canvas Controls */}
      <div className="absolute right-2 top-2 z-20 flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50/90 p-1 shadow-xl backdrop-blur-md sm:right-4 sm:top-4 sm:gap-1.5">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="flex h-10 w-10 items-center justify-center rounded text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 sm:h-8 sm:w-8"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="flex h-10 w-10 items-center justify-center rounded text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 sm:h-8 sm:w-8"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-gray-100" />
        <button
          onClick={handleResetView}
          title="Reset View"
          className="flex h-10 w-10 items-center justify-center rounded text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 sm:h-8 sm:w-8"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <span className="text-[11px] font-mono text-gray-600 px-2">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Top Left Live Status Banner */}
      <div className="absolute left-2 top-2 z-20 flex max-w-[calc(100%-8rem)] items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/90 px-2 py-1.5 shadow-xl backdrop-blur-md sm:left-4 sm:top-4 sm:px-3">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="truncate text-[10px] font-mono text-gray-700 sm:text-xs">
          FSM: <span className="font-semibold text-gray-900">{instance.nodes.length} Nodes</span>
        </span>
      </div>

      {/* Bottom Left Help Hint */}
      <div className="absolute bottom-2 left-2 z-20 hidden rounded-lg border border-gray-200 bg-gray-50/90 px-3 py-1.5 text-[10px] font-mono text-gray-600 shadow-xl sm:bottom-4 sm:left-4 sm:block">
        <span className="font-semibold text-gray-800">Tip:</span> Drag empty space to pan • Scroll to zoom • Click nodes to select
      </div>

      {/* Transformable Canvas Surface */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          width: `${maxX}px`,
          height: `${maxY}px`,
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        className="transition-transform duration-75 ease-out"
      >
        {/* SVG Edges Layer */}
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ width: `${maxX}px`, height: `${maxY}px` }}
        >
          <defs>
            <linearGradient id="edge-active-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="edge-completed-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {instance.edges.map((edge) => {
            const sourceNode = instance.nodes.find((n) => n.id === edge.sourceNodeId);
            const targetNode = instance.nodes.find((n) => n.id === edge.targetNodeId);

            if (!sourceNode || !targetNode) return null;

            const pathData = getEdgePath(sourceNode, targetNode);
            const isTargetRunning = targetNode.status === 'RUNNING';
            const isSourceCompleted = sourceNode.status === 'COMPLETED';
            const isTargetCompleted = targetNode.status === 'COMPLETED';

            let strokeColor = '#334155'; // default slate-700
            let strokeWidth = 2;
            let strokeDasharray = 'none';

            if (isTargetRunning) {
              strokeColor = 'url(#edge-active-gradient)';
              strokeWidth = 3;
            } else if (isSourceCompleted && isTargetCompleted) {
              strokeColor = 'url(#edge-completed-gradient)';
              strokeWidth = 2.5;
            } else if (isSourceCompleted && targetNode.status === 'WAITING_APPROVAL') {
              strokeColor = '#f59e0b'; // amber
              strokeWidth = 2.5;
            } else if (!isSourceCompleted) {
              strokeDasharray = '5,5';
            }

            return (
              <g key={edge.id}>
                {/* Background shadow stroke */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="#090a0f"
                  strokeWidth={strokeWidth + 4}
                />
                {/* Main edge path */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  filter={isTargetRunning ? 'url(#glow)' : undefined}
                />
                {/* Animated in-flight particle for running nodes */}
                {isTargetRunning && (
                  <circle r="4" fill="#38bdf8" filter="url(#glow)">
                    <animateMotion
                      path={pathData}
                      dur="1.2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* HTML Node Cards Layer */}
        {instance.nodes.map((node) => (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: `${node.position.x}px`,
              top: `${node.position.y}px`,
            }}
          >
            <WorkflowNodeCard
              node={node}
              isSelected={selectedNodeId === node.id}
              onSelect={(n) => onSelectNode?.(n)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
