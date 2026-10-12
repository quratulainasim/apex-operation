import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  WorkflowInstance,
  WorkflowTemplate,
  WorkflowNode,
  AIIntentAnalysis,
} from '@/types/workflow';
import { AuditEvent } from '@/types/audit';
import {
  ENTERPRISE_WORKFLOW_TEMPLATES,
  createInstanceFromTemplate,
  INSTANT_PROMPT_PRESETS,
} from '@/lib/presets/scenarios';
import { executeNextNode, applyHumanDecision } from '@/lib/engine/fsm-executor';
import { createAuditEvent } from '@/lib/engine/audit-logger';

export interface ServiceHealth {
  name: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE';
  latencyMs: number;
  uptimePercent: number;
  lastChecked: string;
}

export function collectAuditTrail(instances: WorkflowInstance[]): AuditEvent[] {
  return instances
    .flatMap((instance) => instance.auditTrail || [])
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

interface WorkflowState {
  // Data
  instances: WorkflowInstance[];
  activeInstanceId: string | null;
  templates: WorkflowTemplate[];
  selectedNodeId: string | null;
  isApprovalDrawerOpen: boolean;

  // Execution & Simulation controls
  isPlaying: boolean;
  playbackSpeed: number; // 0.5, 1, 3, 10
  isExecutingStep: boolean;

  // Telemetry & Health
  serviceHealth: Record<string, ServiceHealth>;
  stats: {
    totalExecutions: number;
    completedSuccess: number;
    pendingApprovals: number;
    slaBreaches: number;
    automationRate: number;
    costSavingsUsd: number;
  };

  // Actions
  setActiveInstance: (id: string | null) => void;
  setSelectedNode: (nodeId: string | null) => void;
  setPlaybackSpeed: (speed: number) => void;
  setIsApprovalDrawerOpen: (isOpen: boolean) => void;

  // Workflow Lifecycles
  initDemoState: () => void;
  launchTemplateInstance: (templateId: string, customVars?: Record<string, any>) => string;
  launchFromAIAnalysis: (analysis: AIIntentAnalysis) => string;
  stepWorkflow: (instanceId?: string) => Promise<boolean>; // returns true if halted or finished
  startAutoPlay: (instanceId?: string) => void;
  pauseAutoPlay: () => void;
  handleApprovalDecision: (
    instanceId: string,
    decision: 'APPROVED' | 'REJECTED',
    note: string,
    decidedBy?: string
  ) => Promise<void>;
  resetInstance: (instanceId: string) => void;
  deleteInstance: (instanceId: string) => void;
  loadPresetScenario: (presetIndex: number) => Promise<string>;
  getAllAuditTrail: () => AuditEvent[];
}

const DEFAULT_SERVICE_HEALTH: Record<string, ServiceHealth> = {
  SALESFORCE: {
    name: 'Salesforce CRM Enterprise',
    status: 'OPERATIONAL',
    latencyMs: 142,
    uptimePercent: 99.98,
    lastChecked: 'Just now',
  },
  SAP: {
    name: 'SAP S/4HANA Cloud ERP',
    status: 'OPERATIONAL',
    latencyMs: 215,
    uptimePercent: 99.94,
    lastChecked: 'Just now',
  },
  JIRA: {
    name: 'Atlassian Jira Cloud',
    status: 'OPERATIONAL',
    latencyMs: 98,
    uptimePercent: 99.99,
    lastChecked: 'Just now',
  },
  STRIPE: {
    name: 'Stripe Corporate Billing',
    status: 'OPERATIONAL',
    latencyMs: 65,
    uptimePercent: 100.0,
    lastChecked: 'Just now',
  },
  SLACK: {
    name: 'Slack Enterprise Grid',
    status: 'OPERATIONAL',
    latencyMs: 42,
    uptimePercent: 99.99,
    lastChecked: 'Just now',
  },
  AWS: {
    name: 'AWS Cloud Infrastructure',
    status: 'OPERATIONAL',
    latencyMs: 38,
    uptimePercent: 99.99,
    lastChecked: 'Just now',
  },
};

let autoPlayTimer: NodeJS.Timeout | null = null;

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      instances: [],
      activeInstanceId: null,
      templates: ENTERPRISE_WORKFLOW_TEMPLATES,
      selectedNodeId: null,
      isApprovalDrawerOpen: false,
      isPlaying: false,
      playbackSpeed: 1,
      isExecutingStep: false,
      serviceHealth: DEFAULT_SERVICE_HEALTH,
      stats: {
        totalExecutions: 4892,
        completedSuccess: 4716,
        pendingApprovals: 2,
        slaBreaches: 0,
        automationRate: 96.4,
        costSavingsUsd: 184500,
      },

      setActiveInstance: (id) => {
        set({ activeInstanceId: id, selectedNodeId: null });
      },

      setSelectedNode: (nodeId) => {
        set({ selectedNodeId: nodeId });
      },

      setPlaybackSpeed: (speed) => {
        set({ playbackSpeed: speed });
      },

      setIsApprovalDrawerOpen: (isOpen) => {
        set({ isApprovalDrawerOpen: isOpen });
      },

      initDemoState: () => {
        const currentInstances = get().instances;
        if (currentInstances.length === 0) {
          // Scaffold the 5 showcase workflow instances
          const inst1 = createInstanceFromTemplate(ENTERPRISE_WORKFLOW_TEMPLATES[0]);
          const inst2 = createInstanceFromTemplate(ENTERPRISE_WORKFLOW_TEMPLATES[1]);
          const inst3 = createInstanceFromTemplate(ENTERPRISE_WORKFLOW_TEMPLATES[2]);
          const inst4 = createInstanceFromTemplate(ENTERPRISE_WORKFLOW_TEMPLATES[3]);
          const inst5 = createInstanceFromTemplate(ENTERPRISE_WORKFLOW_TEMPLATES[4]);

          set({
            instances: [inst1, inst2, inst3, inst4, inst5],
            activeInstanceId: inst1.id,
          });
        }
      },

      launchTemplateInstance: (templateId, customVars) => {
        const template =
          get().templates.find((t) => t.id === templateId) ||
          ENTERPRISE_WORKFLOW_TEMPLATES[0];

        const newInstance = createInstanceFromTemplate(template, customVars, {
          type: 'USER',
          actor: 'Operations Engineer',
        });

        set((state) => ({
          instances: [newInstance, ...state.instances],
          activeInstanceId: newInstance.id,
          selectedNodeId: null,
        }));

        return newInstance.id;
      },

      launchFromAIAnalysis: (analysis) => {
        // Find matching template or fallback to template 1
        const template =
          get().templates.find((t) => t.id === analysis.recommendedWorkflowId) ||
          get().templates[0];

        const newInstance = createInstanceFromTemplate(
          template,
          analysis.suggestedVariables,
          {
            type: 'USER',
            actor: 'AI Natural Language Classifier',
          }
        );

        newInstance.context.aiAnalysis = analysis;
        newInstance.context.initialRequest = analysis.rawPrompt;

        set((state) => ({
          instances: [newInstance, ...state.instances],
          activeInstanceId: newInstance.id,
          selectedNodeId: null,
        }));

        return newInstance.id;
      },

      stepWorkflow: async (targetId) => {
        const state = get();
        const instanceId = targetId || state.activeInstanceId;
        if (!instanceId || state.isExecutingStep) return true;

        const instance = state.instances.find((i) => i.id === instanceId);
        if (!instance || instance.status === 'SUCCESS' || instance.status === 'FAILED' || instance.status === 'CANCELLED') {
          return true;
        }

        set({ isExecutingStep: true });

        try {
          const result = await executeNextNode(instance);

          set((s) => ({
            instances: s.instances.map((inst) =>
              inst.id === instanceId ? result.updatedInstance : inst
            ),
            isApprovalDrawerOpen: result.shouldPauseForHuman ? true : s.isApprovalDrawerOpen,
            isExecutingStep: false,
          }));

          if (result.shouldPauseForHuman || result.isComplete) {
            get().pauseAutoPlay();
            return true;
          }

          return false;
        } catch (err) {
          console.error('Workflow step execution error:', err);
          set({ isExecutingStep: false });
          get().pauseAutoPlay();
          return true;
        }
      },

      startAutoPlay: (targetId) => {
        const instanceId = targetId || get().activeInstanceId;
        if (!instanceId) return;

        if (autoPlayTimer) {
          clearInterval(autoPlayTimer);
          autoPlayTimer = null;
        }

        set({ isPlaying: true });

        const runLoop = async () => {
          const speed = get().playbackSpeed;
          // Calculate interval: 1x = 1200ms, 3x = 400ms, 0.5x = 2400ms, 10x = 100ms
          const interval = Math.max(100, Math.round(1200 / speed));

          const shouldStop = await get().stepWorkflow(instanceId);
          if (shouldStop || !get().isPlaying) {
            get().pauseAutoPlay();
          } else {
            autoPlayTimer = setTimeout(runLoop, interval);
          }
        };

        runLoop();
      },

      pauseAutoPlay: () => {
        if (autoPlayTimer) {
          clearTimeout(autoPlayTimer);
          autoPlayTimer = null;
        }
        set({ isPlaying: false });
      },

      handleApprovalDecision: async (instanceId, decision, note, decidedBy = 'VP_SUPPORT') => {
        const instance = get().instances.find((i) => i.id === instanceId);
        if (!instance) return;

        const updatedInstance = await applyHumanDecision(instance, decision, note, decidedBy);

        set((state) => ({
          instances: state.instances.map((i) => (i.id === instanceId ? updatedInstance : i)),
          isApprovalDrawerOpen: false,
        }));

        // If approved, automatically resume workflow playback
        if (decision === 'APPROVED') {
          setTimeout(() => {
            get().startAutoPlay(instanceId);
          }, 400);
        }
      },

      resetInstance: (instanceId) => {
        const instance = get().instances.find((i) => i.id === instanceId);
        if (!instance) return;

        const template =
          get().templates.find((t) => t.id === instance.workflowTemplateId) ||
          get().templates[0];

        const fresh = createInstanceFromTemplate(template, instance.context.variables, instance.triggeredBy);
        fresh.id = instance.id; // Retain same ID for seamless UX

        set((state) => ({
          instances: state.instances.map((i) => (i.id === instanceId ? fresh : i)),
          selectedNodeId: null,
          isPlaying: false,
          isApprovalDrawerOpen: false,
        }));
      },

      deleteInstance: (instanceId) => {
        set((state) => {
          const remaining = state.instances.filter((i) => i.id !== instanceId);
          return {
            instances: remaining,
            activeInstanceId:
              state.activeInstanceId === instanceId
                ? remaining[0]?.id || null
                : state.activeInstanceId,
          };
        });
      },

      loadPresetScenario: async (presetIndex) => {
        const preset = INSTANT_PROMPT_PRESETS[presetIndex] || INSTANT_PROMPT_PRESETS[0];
        const template =
          get().templates.find((t) => t.id === preset.targetTemplateId) ||
          get().templates[0];

        const newInstance = createInstanceFromTemplate(template, undefined, {
          type: 'DEMO_SIMULATOR',
          actor: 'Executive Presenter (Preset)',
        });
        newInstance.context.initialRequest = preset.prompt;

        set((state) => ({
          instances: [newInstance, ...state.instances],
          activeInstanceId: newInstance.id,
          selectedNodeId: null,
        }));

        return newInstance.id;
      },

      getAllAuditTrail: () => collectAuditTrail(get().instances),
    }),
    {
      name: 'flowops-workflow-store',
      version: 2, // Increment to force cache invalidation
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        instances: state.instances,
        activeInstanceId: state.activeInstanceId,
        playbackSpeed: state.playbackSpeed,
      }),
    }
  )
);
