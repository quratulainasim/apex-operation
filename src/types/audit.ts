export type ActorType =
  | 'AI_AGENT'
  | 'HUMAN_OPERATOR'
  | 'SYSTEM_CORE'
  | 'INTEGRATION_CONNECTOR';

export type AuditActionType =
  | 'REQUEST_RECEIVED'
  | 'INTENT_CLASSIFIED'
  | 'WORKFLOW_INITIALIZED'
  | 'NODE_EXECUTION_START'
  | 'TOOL_DISPATCH_SUCCESS'
  | 'TOOL_DISPATCH_FAILURE'
  | 'APPROVAL_GATE_TRIGGERED'
  | 'APPROVAL_DECISION_RECORDED'
  | 'COMPENSATION_ROLLBACK_EXECUTED'
  | 'WORKFLOW_COMPLETED'
  | 'SLA_BREACH_ESCALATED';

export interface AuditEvent {
  id: string;
  timestamp: string;
  workflowId: string;
  nodeId?: string;
  actorType: ActorType;
  actorName: string;
  actionType: AuditActionType;
  summary: string;
  details: {
    service?: string;
    action?: string;
    payload?: Record<string, any>;
    result?: Record<string, any>;
    approvalRole?: string;
    decision?: 'APPROVED' | 'REJECTED';
    decisionNote?: string;
    policyRule?: string;
    error?: string;
  };
  sha256Hash: string;
  previousHash?: string;
}
