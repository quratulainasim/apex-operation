export interface SalesforceCasePayload {
  caseNumber: string;
  accountId: string;
  accountName: string;
  contactName: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  subject: string;
  description: string;
  contractTier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE_PLATINUM';
  arrUsd: number;
  assignedCsm: string;
}

export interface SapInvoicePayload {
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  poNumber: string;
  billedAmount: number;
  poAmount: number;
  discrepancyAmount: number;
  glAccount: string;
  matchedStatus: 'MATCH' | 'DISCREPANCY_FLAGGED' | 'RESOLVED_ADJUSTED';
}

export interface JiraTicketPayload {
  issueKey: string;
  projectKey: string;
  issueType: 'Bug' | 'Incident' | 'Task' | 'Story';
  summary: string;
  description: string;
  priority: 'Lowest' | 'Low' | 'Medium' | 'High' | 'Highest';
  assignee: string;
  status: 'Open' | 'In Progress' | 'Escalated' | 'Resolved';
}

export interface StripeCreditPayload {
  creditNoteId: string;
  customerId: string;
  customerName: string;
  amountUsd: number;
  currency: string;
  reason: 'sla_breach_compensation' | 'billing_dispute_resolution' | 'courtesy_adjustment';
  status: 'pending_approval' | 'issued' | 'voided';
}

export interface SlackNotificationPayload {
  channel: string;
  headline: string;
  urgency: 'INFO' | 'WARNING' | 'CRITICAL';
  blocks: Array<{
    type: string;
    text?: string;
    fields?: Array<{ title: string; value: string }>;
  }>;
}

export interface AwsIamRevocationPayload {
  incidentId: string;
  targetRoleArn: string;
  targetUser: string;
  affectedResources: string[];
  actionTaken: 'REVOKE_ACTIVE_SESSIONS' | 'ATTACH_RESTRICTIVE_POLICY' | 'QUARANTINE_INSTANCE';
  status: 'SUCCESS' | 'FAILED';
}
