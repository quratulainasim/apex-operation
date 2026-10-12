import { ExecutionLog, WorkflowInstance, WorkflowNode, NodeStatus } from '@/types/workflow';
import { createAuditEvent } from './audit-logger';
import { dispatchEnterpriseConnector } from '@/lib/integrations';
import { generateId } from '@/lib/utils';

export interface ExecutionStepResult {
  updatedInstance: WorkflowInstance;
  shouldPauseForHuman: boolean;
  isComplete: boolean;
  hasError: boolean;
}

function createExecutionLog(
  level: ExecutionLog['level'],
  message: string,
  nodeId?: string,
  meta?: Record<string, unknown>
): ExecutionLog {
  return {
    id: generateId('LOG'),
    timestamp: new Date().toISOString(),
    level,
    nodeId,
    message,
    ...(meta ? { meta } : {}),
  };
}

/**
 * Execute the next available pending node in the workflow DAG
 */
export async function executeNextNode(
  instance: WorkflowInstance,
  options: {
    customToolExecutor?: (node: WorkflowNode, context: Record<string, any>) => Promise<Record<string, any>>;
  } = {}
): Promise<ExecutionStepResult> {
  const nodes = [...instance.nodes];
  const edges = [...instance.edges];

  // 1. Find the next node that is ready to execute (status PENDING or IDLE and all predecessors COMPLETED)
  const nextNodeIndex = nodes.findIndex((node) => {
    if (node.status !== 'PENDING' && node.status !== 'IDLE') return false;

    // Check incoming edges
    const incomingEdges = edges.filter((e) => e.targetNodeId === node.id);
    if (incomingEdges.length === 0) return true;

    // All predecessor nodes must be COMPLETED or SKIPPED
    return incomingEdges.every((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.sourceNodeId);
      return sourceNode?.status === 'COMPLETED' || sourceNode?.status === 'SKIPPED';
    });
  });

  if (nextNodeIndex === -1) {
    // Check if all nodes are completed
    const allDone = nodes.every(
      (n) => n.status === 'COMPLETED' || n.status === 'SKIPPED' || n.status === 'COMPENSATED'
    );
    const anyFailed = nodes.some((n) => n.status === 'FAILED');

    const updatedInstance: WorkflowInstance = {
      ...instance,
      status: anyFailed ? 'FAILED' : allDone ? 'SUCCESS' : instance.status,
      completedAt: allDone || anyFailed ? new Date().toISOString() : instance.completedAt,
    };

    return {
      updatedInstance,
      shouldPauseForHuman: false,
      isComplete: allDone || anyFailed,
      hasError: anyFailed,
    };
  }

  const targetNode = { ...nodes[nextNodeIndex] };

  // 2. Check if this is a HUMAN_APPROVAL node
  if (targetNode.type === 'HUMAN_APPROVAL') {
    targetNode.status = 'WAITING_APPROVAL';
    nodes[nextNodeIndex] = targetNode;

    // Create approval request if not already present
    const approvalRequest = instance.approvalRequest || {
      id: `APPR-${Date.now()}`,
      workflowId: instance.id,
      nodeId: targetNode.id,
      title: targetNode.name,
      action: targetNode.action,
      reason: targetNode.approvalConfig?.policyRule || 'Executive Human Governance Sign-off Required',
      policyTrigger: targetNode.approvalConfig?.policyRule || 'Policy Compliance Threshold',
      riskLevel: instance.context.aiAnalysis?.riskEvaluation.level || 'HIGH',
      approverRole: targetNode.approvalConfig?.approverRole || 'VP_SUPPORT',
      status: 'PENDING',
      requestedAt: new Date().toISOString(),
      beforeState: {
        status: 'PENDING_APPROVAL',
        accountTier: instance.context.variables.accountTier || 'ENTERPRISE',
      },
      proposedState: {
        status: 'EXECUTED_APPROVED',
        creditAmountUsd: instance.context.variables.creditAmount || instance.context.variables.invoiceAmount || 15000,
        authorizedAction: targetNode.action,
      },
      financialImpactUsd:
        instance.context.variables.creditAmount ||
        instance.context.variables.invoiceAmount ||
        instance.context.aiAnalysis?.riskEvaluation.financialExposureUsd ||
        15000,
    };

    const audit = await createAuditEvent({
      workflowId: instance.id,
      nodeId: targetNode.id,
      actorType: 'SYSTEM_CORE',
      actorName: 'Governance FSM Guard',
      actionType: 'APPROVAL_GATE_TRIGGERED',
      summary: `Halted pipeline execution at node [${targetNode.name}]. Waiting for ${targetNode.approvalConfig?.approverRole || 'Executive'} approval.`,
      details: { policy: targetNode.approvalConfig?.policyRule },
    });

    const updatedInstance: WorkflowInstance = {
      ...instance,
      status: 'WAITING_FOR_HUMAN',
      nodes,
      approvalRequest,
      auditTrail: [audit, ...instance.auditTrail],
      logs: [
        createExecutionLog(
          'WARN',
          `Execution paused at [${targetNode.name}] pending ${targetNode.approvalConfig?.approverRole || 'human'} approval.`,
          targetNode.id,
          { policy: targetNode.approvalConfig?.policyRule }
        ),
        ...(instance.logs || []),
      ],
    };

    return {
      updatedInstance,
      shouldPauseForHuman: true,
      isComplete: false,
      hasError: false,
    };
  }

  // 3. Mark node as RUNNING
  targetNode.status = 'RUNNING';
  targetNode.executionMetrics = {
    startTime: Date.now(),
    retryCount: 0,
  };
  nodes[nextNodeIndex] = targetNode;

  // Set active edge animations
  const updatedEdges = edges.map((e) => {
    if (e.targetNodeId === targetNode.id) {
      return { ...e, status: 'ACTIVE' as const, isAnimated: true };
    }
    return e;
  });

  // 4. Simulate or execute the tool integration action
  const startTime = Date.now();
  let stepOutput: Record<string, any> = {};

  if (options.customToolExecutor) {
    try {
      stepOutput = await options.customToolExecutor(targetNode, instance.context);
    } catch (err: any) {
      targetNode.status = 'FAILED';
      targetNode.executionMetrics = {
        startTime,
        endTime: Date.now(),
        durationMs: Date.now() - startTime,
        retryCount: 0,
        error: err.message || 'Execution error',
      };
      nodes[nextNodeIndex] = targetNode;

      const failAudit = await createAuditEvent({
        workflowId: instance.id,
        nodeId: targetNode.id,
        actorType: 'INTEGRATION_CONNECTOR',
        actorName: `${targetNode.service}_CONNECTOR`,
        actionType: 'TOOL_DISPATCH_FAILURE',
        summary: `Execution failed at [${targetNode.name}]: ${err.message}`,
        details: { error: err.message },
      });

      return {
        updatedInstance: {
          ...instance,
          status: 'FAILED',
          nodes,
          edges: updatedEdges,
          auditTrail: [failAudit, ...instance.auditTrail],
          logs: [
            createExecutionLog(
              'ERROR',
              `Execution failed at [${targetNode.name}]: ${err instanceof Error ? err.message : 'Execution error'}`,
              targetNode.id,
              { error: err instanceof Error ? err.message : 'Execution error' }
            ),
            ...(instance.logs || []),
          ],
        },
        shouldPauseForHuman: false,
        isComplete: true,
        hasError: true,
      };
    }
  } else {
    // Dispatch to enterprise connector mock with full realistic payload generation
    try {
      stepOutput = await dispatchEnterpriseConnector(targetNode, instance.context);
    } catch (e: any) {
      stepOutput = generateDefaultToolOutput(targetNode, instance.context);
    }
  }

  // 5. Mark node as COMPLETED
  const endTime = Date.now();
  targetNode.status = 'COMPLETED';
  targetNode.executionMetrics = {
    startTime,
    endTime,
    durationMs: endTime - startTime,
    retryCount: 0,
  };
  nodes[nextNodeIndex] = targetNode;

  // Mark incoming edges as COMPLETED
  const finalEdges = updatedEdges.map((e) => {
    if (e.targetNodeId === targetNode.id) {
      return { ...e, status: 'COMPLETED' as const, isAnimated: false };
    }
    return e;
  });

  // Record audit log
  const audit = await createAuditEvent({
    workflowId: instance.id,
    nodeId: targetNode.id,
    actorType: targetNode.type === 'AI_TRANSFORM' ? 'AI_AGENT' : 'INTEGRATION_CONNECTOR',
    actorName: `${targetNode.service}_ADAPTER`,
    actionType: 'TOOL_DISPATCH_SUCCESS',
    summary: `Successfully executed action [${targetNode.action}] on ${targetNode.service}.`,
    details: {
      action: targetNode.action,
      output: stepOutput,
      durationMs: endTime - startTime,
    },
  });

  const updatedVariables = {
    ...instance.context.variables,
    ...stepOutput,
  };

  const updatedStepOutputs = {
    ...instance.context.stepOutputs,
    [targetNode.id]: stepOutput,
  };

  // Check if remaining nodes exist
  const remainingPending = nodes.some((n) => n.status === 'PENDING' || n.status === 'IDLE');

  const updatedInstance: WorkflowInstance = {
    ...instance,
    status: remainingPending ? 'RUNNING' : 'SUCCESS',
    startedAt: instance.startedAt || new Date().toISOString(),
    completedAt: remainingPending ? undefined : new Date().toISOString(),
    durationMs: (instance.durationMs || 0) + (endTime - startTime),
    nodes,
    edges: finalEdges,
    context: {
      ...instance.context,
      variables: updatedVariables,
      stepOutputs: updatedStepOutputs,
    },
    auditTrail: [audit, ...instance.auditTrail],
    logs: [
      createExecutionLog(
        'EXEC',
        `Successfully executed action [${targetNode.action}] on ${targetNode.service}.`,
        targetNode.id,
        { durationMs: endTime - startTime, output: stepOutput }
      ),
      ...(instance.logs || []),
    ],
  };

  return {
    updatedInstance,
    shouldPauseForHuman: false,
    isComplete: !remainingPending,
    hasError: false,
  };
}

/**
 * Handle human decision (APPROVE or REJECT) and resume the FSM
 */
export async function applyHumanDecision(
  instance: WorkflowInstance,
  decision: 'APPROVED' | 'REJECTED',
  note: string,
  decidedBy: string = 'VP_SUPPORT'
): Promise<WorkflowInstance> {
  const nodes = [...instance.nodes];
  const waitingNodeIndex = nodes.findIndex((n) => n.status === 'WAITING_APPROVAL');

  if (waitingNodeIndex === -1 || !instance.approvalRequest) {
    return instance;
  }

  const waitingNode = { ...nodes[waitingNodeIndex] };

  if (decision === 'APPROVED') {
    waitingNode.status = 'COMPLETED';
    waitingNode.executionMetrics = {
      startTime: Date.now() - 1000,
      endTime: Date.now(),
      durationMs: 1000,
      retryCount: 0,
    };
    nodes[waitingNodeIndex] = waitingNode;

    const audit = await createAuditEvent({
      workflowId: instance.id,
      nodeId: waitingNode.id,
      actorType: 'HUMAN_OPERATOR',
      actorName: decidedBy,
      actionType: 'APPROVAL_DECISION_RECORDED',
      summary: `Human Approval GRANTED by ${decidedBy}: "${note}"`,
      details: { decision: 'APPROVED', note, decidedBy },
    });

    return {
      ...instance,
      status: 'RUNNING',
      nodes,
      approvalRequest: {
        ...instance.approvalRequest,
        status: 'APPROVED',
        decidedAt: new Date().toISOString(),
        decidedBy,
        decisionNote: note,
      },
      auditTrail: [audit, ...instance.auditTrail],
      logs: [
        createExecutionLog('INFO', `Approval granted by ${decidedBy}: ${note}`, waitingNode.id, {
          decision: 'APPROVED',
          decidedBy,
        }),
        ...(instance.logs || []),
      ],
    };
  } else {
    // REJECTED -> Trigger compensation rollback
    waitingNode.status = 'COMPENSATED';
    nodes[waitingNodeIndex] = waitingNode;

    // Mark downstream nodes as SKIPPED
    const finalNodes = nodes.map((n, idx) => {
      if (idx > waitingNodeIndex && n.status === 'PENDING') {
        return { ...n, status: 'SKIPPED' as NodeStatus };
      }
      return n;
    });

    const audit = await createAuditEvent({
      workflowId: instance.id,
      nodeId: waitingNode.id,
      actorType: 'HUMAN_OPERATOR',
      actorName: decidedBy,
      actionType: 'COMPENSATION_ROLLBACK_EXECUTED',
      summary: `Human Approval REJECTED by ${decidedBy}. Initiated compensation rollback. Rationale: "${note}"`,
      details: { decision: 'REJECTED', note, decidedBy },
    });

    return {
      ...instance,
      status: 'CANCELLED',
      completedAt: new Date().toISOString(),
      nodes: finalNodes,
      approvalRequest: {
        ...instance.approvalRequest,
        status: 'REJECTED',
        decidedAt: new Date().toISOString(),
        decidedBy,
        decisionNote: note,
      },
      auditTrail: [audit, ...instance.auditTrail],
      logs: [
        createExecutionLog('WARN', `Approval rejected by ${decidedBy}; compensation rollback initiated.`, waitingNode.id, {
          decision: 'REJECTED',
          decidedBy,
        }),
        ...(instance.logs || []),
      ],
    };
  }
}

function generateDefaultToolOutput(node: WorkflowNode, context: Record<string, any>): Record<string, any> {
  const ts = Date.now().toString().slice(-4);

  switch (node.service) {
    case 'SALESFORCE':
      return {
        caseNumber: `SF-CASE-${ts}`,
        accountTier: context.variables?.accountTier || 'ENTERPRISE_PLATINUM',
        csmAssigned: 'Sarah Jenkins (VP Accounts)',
        slaWindowRemaining: '3.8 hours',
      };
    case 'SAP':
      return {
        sapDocumentId: `SAP-DOC-4920${ts}`,
        glStatus: 'POSTED_TO_SUSPENSE_LEDGER',
        varianceAcknowledged: true,
      };
    case 'JIRA':
      return {
        issueKey: `PROD-89${ts}`,
        issueStatus: 'IN_PROGRESS',
        assignedTeam: 'Core Infrastructure On-Call',
        priority: 'Highest',
      };
    case 'STRIPE':
      return {
        creditNoteId: `CN_10492${ts}`,
        amountCreditedUsd: context.variables?.creditAmount || 15000,
        balanceAdjustmentStatus: 'COMPLETED_APPLIED',
      };
    case 'SLACK':
      return {
        messageTs: `1728900.${ts}`,
        channel: '#enterprise-escalations',
        deliveredUsers: 24,
      };
    case 'AWS':
      return {
        quarantinedSessions: 2,
        securityGroupRevoked: 'sg-0a81e9f4a',
        containmentStatus: 'ACTIVE_CONTAINED',
      };
    default:
      return {
        executedAction: node.action,
        timestamp: new Date().toISOString(),
        status: 'OK_200',
      };
  }
}
