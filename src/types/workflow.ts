import { AuditEvent } from './audit';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type RiskLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type NodeStatus =
  | 'IDLE'
  | 'PENDING'
  | 'RUNNING'
  | 'WAITING_APPROVAL'
  | 'COMPLETED'
  | 'FAILED'
  | 'COMPENSATED'
  | 'SKIPPED';

export type WorkflowStatus =
  | 'DRAFT'
  | 'READY'
  | 'RUNNING'
  | 'PAUSED'
  | 'WAITING_FOR_HUMAN'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED';

export type NodeType =
  | 'TRIGGER'
  | 'AI_TRANSFORM'
  | 'INTEGRATION_ACTION'
  | 'CONDITIONAL_BRANCH'
  | 'HUMAN_APPROVAL'
  | 'VERIFICATION_ASSERTION'
  | 'NOTIFICATION'
  | 'END';

export type EnterpriseService =
  | 'SALESFORCE'
  | 'SAP'
  | 'JIRA'
  | 'STRIPE'
  | 'SLACK'
  | 'AWS'
  | 'OKTA'
  | 'INTERNAL_ENGINE';

export interface AIIntentAnalysis {
  requestId: string;
  rawPrompt: string;
  summary: string;
  intentCategory:
    | 'CUSTOMER_SUPPORT'
    | 'FINANCIAL_OPERATIONS'
    | 'IT_INFRASTRUCTURE'
    | 'SECURITY_INCIDENT'
    | 'PROCUREMENT'
    | 'GENERAL_OPERATIONS';
  confidenceScore: number; // 0.0 - 1.0
  urgency: PriorityLevel;
  estimatedSlaMinutes: number;
  extractedEntities: Record<string, any>;
  riskEvaluation: {
    level: RiskLevel;
    requiresHumanApproval: boolean;
    policyTrigger: string | null;
    financialExposureUsd: number;
  };
  recommendedWorkflowId: string;
  recommendedWorkflowTitle: string;
  suggestedVariables: Record<string, any>;
  rationale: string;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  description: string;
  service: EnterpriseService;
  action: string;
  inputPayloadTemplate: Record<string, any>;
  outputSchema?: Record<string, any>;
  status: NodeStatus;
  executionMetrics?: {
    startTime?: number;
    endTime?: number;
    durationMs?: number;
    retryCount: number;
    error?: string;
  };
  approvalConfig?: {
    approverRole: 'CFO' | 'CISO' | 'VP_SUPPORT' | 'DEVOPS_LEAD' | 'OPERATIONS_MANAGER';
    timeoutMinutes: number;
    autoEscalateTo?: string;
    reasonRequired: boolean;
    policyRule: string;
  };
  retryPolicy?: {
    maxRetries: number;
    backoffMs: number;
  };
  compensationAction?: string; // Rollback step if subsequent nodes fail
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
  condition?: string;
  isAnimated?: boolean;
  status: 'INACTIVE' | 'ACTIVE' | 'COMPLETED' | 'FAILED';
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'EXEC' | 'WARN' | 'ERROR';
  nodeId?: string;
  message: string;
  meta?: Record<string, unknown>;
}

export interface HumanApprovalRequest {
  id: string;
  workflowId: string;
  nodeId: string;
  title: string;
  action: string;
  reason: string;
  policyTrigger: string;
  riskLevel: RiskLevel;
  approverRole: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  requestedAt: string;
  decidedAt?: string;
  decidedBy?: string;
  decisionNote?: string;
  beforeState: Record<string, any>;
  proposedState: Record<string, any>;
  financialImpactUsd?: number;
}

export interface WorkflowInstance {
  id: string;
  workflowTemplateId: string;
  title: string;
  description: string;
  status: WorkflowStatus;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  triggeredBy: {
    type: 'USER' | 'WEBHOOK' | 'SCHEDULE' | 'SYSTEM' | 'DEMO_SIMULATOR';
    actor: string;
  };
  context: {
    initialRequest: string;
    aiAnalysis?: AIIntentAnalysis;
    variables: Record<string, any>;
    stepOutputs: Record<string, any>;
  };
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  approvalRequest?: HumanApprovalRequest;
  executionSpeedMs: number; // Node delay in ms (e.g. 500ms for 2x, 1000ms for 1x)
  auditTrail: AuditEvent[];
  logs?: ExecutionLog[];
  error?: string;
}

export interface WorkflowTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  version: string;
  estimatedDuration: string;
  successRate: number;
  executionCount: number;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  defaultVariables: Record<string, any>;
  tags: string[];
}

export function isWorkflowWaitingApproval(instance: WorkflowInstance): boolean {
  return (
    instance.status === 'WAITING_FOR_HUMAN' ||
    instance.nodes.some((node) => node.status === 'WAITING_APPROVAL')
  );
}
