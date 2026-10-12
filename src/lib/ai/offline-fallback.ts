import { AIIntentAnalysis, PriorityLevel, RiskLevel } from '@/types/workflow';
import { generateId } from '@/lib/utils';

export function analyzeRequestOffline(rawPrompt: string): AIIntentAnalysis {
  const lower = rawPrompt.toLowerCase();

  // Pattern 1: High Priority Customer Complaint / SLA Breach / Refund
  if (
    lower.includes('complaint') ||
    lower.includes('sla') ||
    lower.includes('outage') ||
    lower.includes('refund') ||
    lower.includes('credit') ||
    lower.includes('customer')
  ) {
    const isCritical = lower.includes('outage') || lower.includes('high') || lower.includes('sla');
    const dollarMatch = rawPrompt.match(/\$([0-9,]+(\.[0-9]{2})?)/);
    const amount = dollarMatch ? parseFloat(dollarMatch[1].replace(/,/g, '')) : 15000;
    const requiresApproval = amount >= 5000 || isCritical;

    return {
      requestId: generateId('REQ'),
      rawPrompt,
      summary: 'High-priority enterprise customer service escalation with SLA financial compensation request.',
      intentCategory: 'CUSTOMER_SUPPORT',
      confidenceScore: 0.98,
      urgency: (isCritical ? 'CRITICAL' : 'HIGH') as PriorityLevel,
      estimatedSlaMinutes: 30,
      extractedEntities: {
        customerName: extractCustomerName(rawPrompt) || 'Acme Global Enterprises',
        incidentType: 'Production Service Disruption',
        contractTier: 'ENTERPRISE_PLATINUM',
        requestedCompensationUsd: amount,
        slaBreachHours: 4.2,
      },
      riskEvaluation: {
        level: (amount > 10000 ? 'HIGH' : 'MEDIUM') as RiskLevel,
        requiresHumanApproval: requiresApproval,
        policyTrigger: requiresApproval
          ? `Policy FIN-402: Customer credit adjustments exceeding $5,000 require VP/CFO authorization.`
          : null,
        financialExposureUsd: amount,
      },
      recommendedWorkflowId: 'WF-CUST-ESCALATION-01',
      recommendedWorkflowTitle: 'Enterprise Customer SLA Breach & Compensation Resolution',
      suggestedVariables: {
        accountTier: 'ENTERPRISE_PLATINUM',
        creditAmount: amount,
        createJiraTicket: true,
        notifySlackChannel: '#enterprise-escalations',
      },
      rationale:
        'Detected high-severity customer complaint with contractual SLA implications and financial balance adjustment.',
    };
  }

  // Pattern 2: SAP Invoice Processing / Reconciliation Discrepancy
  if (
    lower.includes('invoice') ||
    lower.includes('sap') ||
    lower.includes('discrepancy') ||
    lower.includes('po') ||
    lower.includes('billing') ||
    lower.includes('payment')
  ) {
    const dollarMatch = rawPrompt.match(/\$([0-9,]+(\.[0-9]{2})?)/);
    const amount = dollarMatch ? parseFloat(dollarMatch[1].replace(/,/g, '')) : 48500;
    const requiresApproval = amount >= 10000;

    return {
      requestId: generateId('REQ'),
      rawPrompt,
      summary: 'SAP S/4HANA invoice OCR verification with general ledger reconciliation discrepancy.',
      intentCategory: 'FINANCIAL_OPERATIONS',
      confidenceScore: 0.96,
      urgency: 'HIGH',
      estimatedSlaMinutes: 60,
      extractedEntities: {
        vendorName: 'Apex Logistics & Freight Corp',
        invoiceNumber: 'INV-2026-9941',
        poNumber: 'PO-88320',
        billedAmountUsd: amount,
        poAmountUsd: amount - 3200,
        varianceUsd: 3200,
      },
      riskEvaluation: {
        level: 'HIGH',
        requiresHumanApproval: true,
        policyTrigger: 'Policy SOX-FIN-109: Ledger variance adjustments > $2,500 require CFO sign-off.',
        financialExposureUsd: amount,
      },
      recommendedWorkflowId: 'WF-SAP-INVOICE-02',
      recommendedWorkflowTitle: 'SAP S/4HANA Invoice Discrepancy & Ledger Reconciliation',
      suggestedVariables: {
        vendorId: 'VEND-8841',
        invoiceAmount: amount,
        varianceAmount: 3200,
        ledgerAccount: 'GL-20440-ACCOUNTS-PAYABLE',
      },
      rationale:
        'Parsed vendor invoice mismatch against purchase order records. Requires financial governance sign-off prior to posting.',
    };
  }

  // Pattern 3: Security / Zero-Trust IAM Access Revocation
  if (
    lower.includes('security') ||
    lower.includes('iam') ||
    lower.includes('revok') ||
    lower.includes('ciso') ||
    lower.includes('breach') ||
    lower.includes('access') ||
    lower.includes('okta')
  ) {
    return {
      requestId: generateId('REQ'),
      rawPrompt,
      summary: 'Critical security incident: Zero-trust IAM credential containment and privileged access revocation.',
      intentCategory: 'SECURITY_INCIDENT',
      confidenceScore: 0.99,
      urgency: 'CRITICAL',
      estimatedSlaMinutes: 15,
      extractedEntities: {
        targetIdentity: 'external-contractor-92@partner.domain',
        affectedRole: 'arn:aws:iam::123456789012:role/DataPipelineProdAdmin',
        anomalyType: 'Anomalous Token Export from Unregistered IP (194.26.29.11)',
        blastRadius: '3 Production S3 Buckets, 2 EKS Clusters',
      },
      riskEvaluation: {
        level: 'CRITICAL',
        requiresHumanApproval: true,
        policyTrigger: 'Policy SEC-ZERO-01: Revocation of production admin roles requires CISO cryptographic approval.',
        financialExposureUsd: 0,
      },
      recommendedWorkflowId: 'WF-SEC-IAM-REVOKE-03',
      recommendedWorkflowTitle: 'Zero-Trust IAM Credential Isolation & Incident Containment',
      suggestedVariables: {
        targetUser: 'external-contractor-92@partner.domain',
        quarantineScope: 'ALL_ACTIVE_SESSIONS',
        alertChannel: '#security-soc-alerts',
      },
      rationale:
        'Detected urgent security alert indicating potential credential compromise. Escalates immediately to CISO security ops.',
    };
  }

  // Pattern 4: IT Infrastructure / Cloud FinOps Auto-Scaling
  if (
    lower.includes('cloud') ||
    lower.includes('aws') ||
    lower.includes('kubernetes') ||
    lower.includes('k8s') ||
    lower.includes('scale') ||
    lower.includes('cost') ||
    lower.includes('terraform')
  ) {
    return {
      requestId: generateId('REQ'),
      rawPrompt,
      summary: 'Cloud infrastructure capacity auto-scaling and FinOps cost budget re-allocation.',
      intentCategory: 'IT_INFRASTRUCTURE',
      confidenceScore: 0.94,
      urgency: 'MEDIUM',
      estimatedSlaMinutes: 45,
      extractedEntities: {
        clusterName: 'us-east-1-prod-compute-mesh',
        currentCpuUtilization: '94.2%',
        projectedMonthlyCostDeltaUsd: 4200,
        scalingTargetNodes: 16,
      },
      riskEvaluation: {
        level: 'MEDIUM',
        requiresHumanApproval: true,
        policyTrigger: 'Policy INFRA-FIN-03: Cloud capacity expansions exceeding $3,000/mo require DevOps Lead approval.',
        financialExposureUsd: 4200,
      },
      recommendedWorkflowId: 'WF-INFRA-SCALE-04',
      recommendedWorkflowTitle: 'Cloud Infrastructure Elastic Scaling & Cost Optimization',
      suggestedVariables: {
        clusterId: 'k8s-prod-mesh-01',
        nodeCount: 16,
        instanceType: 'c6i.4xlarge',
      },
      rationale:
        'Detected sustained cluster workload surge exceeding safe thresholds. Prepares terraform provisioning workflow.',
    };
  }

  // Default: General Enterprise Operational Request
  return {
    requestId: generateId('REQ'),
    rawPrompt,
    summary: 'Standard enterprise business workflow automation request.',
    intentCategory: 'GENERAL_OPERATIONS',
    confidenceScore: 0.91,
    urgency: 'MEDIUM',
    estimatedSlaMinutes: 120,
    extractedEntities: {
      requestSummary: rawPrompt.slice(0, 80),
      detectedKeywords: ['business_request', 'automation'],
    },
    riskEvaluation: {
      level: 'LOW',
      requiresHumanApproval: false,
      policyTrigger: null,
      financialExposureUsd: 0,
    },
    recommendedWorkflowId: 'WF-GENERAL-OPS-05',
    recommendedWorkflowTitle: 'Automated Multi-System Operational Task Orchestration',
    suggestedVariables: {
      source: 'PORTAL_INTAKE',
      priority: 'MEDIUM',
    },
    rationale:
      'Standard operational intake mapped to cross-functional enterprise coordination workflow.',
  };
}

function extractCustomerName(text: string): string | null {
  const match = text.match(/(?:client|customer|account|company)\s+([A-Z][A-Za-z0-9\s&]+?)(?:\s+(?:reports|demands|opened|submitted|breached|has|\.|\,)|$)/i);
  return match ? match[1].trim() : null;
}
