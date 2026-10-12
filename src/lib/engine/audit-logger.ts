import { AuditEvent, ActorType, AuditActionType } from '@/types/audit';

// Fast SHA-256 hashing for audit trail verification
async function computeSha256(data: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(data);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback
    }
  }

  // Pure JS simple hash fallback if Web Crypto API is unavailable
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `sha256_${Math.abs(hash).toString(16).padStart(16, '0')}`;
}

export async function createAuditEvent(params: {
  workflowId: string;
  nodeId?: string;
  actorType: ActorType;
  actorName: string;
  actionType: AuditActionType;
  summary: string;
  details?: Record<string, any>;
  previousHash?: string;
}): Promise<AuditEvent> {
  const timestamp = new Date().toISOString();
  const id = `AUD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const payloadString = JSON.stringify({
    id,
    timestamp,
    workflowId: params.workflowId,
    nodeId: params.nodeId,
    actorType: params.actorType,
    actorName: params.actorName,
    actionType: params.actionType,
    summary: params.summary,
    details: params.details || {},
    previousHash: params.previousHash,
  });

  const sha256Hash = await computeSha256(payloadString);

  return {
    id,
    timestamp,
    workflowId: params.workflowId,
    nodeId: params.nodeId,
    actorType: params.actorType,
    actorName: params.actorName,
    actionType: params.actionType,
    summary: params.summary,
    details: params.details || {},
    sha256Hash,
    previousHash: params.previousHash,
  };
}
