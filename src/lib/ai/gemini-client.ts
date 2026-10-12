import { AIIntentAnalysis } from '@/types/workflow';
import { analyzeRequestOffline } from './offline-fallback';
import { GoogleGenAI, Type, Schema } from '@google/genai';
import { generateId } from '@/lib/utils';

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    requestId: { type: Type.STRING },
    rawPrompt: { type: Type.STRING },
    summary: { type: Type.STRING },
    intentCategory: {
      type: Type.STRING,
      enum: [
        'CUSTOMER_SUPPORT',
        'FINANCIAL_OPERATIONS',
        'IT_INFRASTRUCTURE',
        'SECURITY_INCIDENT',
        'PROCUREMENT',
        'GENERAL_OPERATIONS',
      ],
    },
    confidenceScore: { type: Type.NUMBER },
    urgency: {
      type: Type.STRING,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    },
    estimatedSlaMinutes: { type: Type.INTEGER },
    extractedEntities: {
      type: Type.OBJECT,
    },
    riskEvaluation: {
      type: Type.OBJECT,
      properties: {
        level: {
          type: Type.STRING,
          enum: ['NONE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        },
        requiresHumanApproval: { type: Type.BOOLEAN },
        policyTrigger: { type: Type.STRING },
        financialExposureUsd: { type: Type.NUMBER },
      },
      required: ['level', 'requiresHumanApproval', 'financialExposureUsd'],
    },
    recommendedWorkflowId: { type: Type.STRING },
    recommendedWorkflowTitle: { type: Type.STRING },
    suggestedVariables: {
      type: Type.OBJECT,
    },
    rationale: { type: Type.STRING },
  },
  required: [
    'requestId',
    'summary',
    'intentCategory',
    'confidenceScore',
    'urgency',
    'estimatedSlaMinutes',
    'riskEvaluation',
    'recommendedWorkflowId',
    'recommendedWorkflowTitle',
    'rationale',
  ],
};

const SYSTEM_INSTRUCTION = `You are the AI Operations & Workflow Automation Classifier for an Enterprise Company.
Your job is to analyze unstructured business requests (support tickets, invoice disputes, security alerts, IT requests) and structure them for a deterministic workflow automation engine.

CRITICAL RULES:
1. Extract all entities (customer names, dollar amounts, invoice numbers, IAM roles, ticket priorities).
2. Determine risk level and whether Human-in-the-Loop approval is required (Financial impact > $5000, Security privilege mutations, or Production changes ALWAYS require human approval).
3. Select an appropriate recommended workflow ID.
4. Output STRICT JSON conforming to the schema. Do NOT include raw chain-of-thought, markdown code fences, or explanatory text.
5. Provide a concise, executive-level summary and rationale.`;

export type AnalysisSource = 'GEMINI_3_6_FLASH' | 'DETERMINISTIC_OFFLINE';

export interface BusinessRequestAnalysis {
  analysis: AIIntentAnalysis;
  source: AnalysisSource;
}

export async function analyzeBusinessRequest(
  prompt: string,
  context?: Record<string, unknown>
): Promise<BusinessRequestAnalysis> {
  const contextualPrompt = context
    ? `${prompt}\n\nAdditional request context:\n${JSON.stringify(context)}`
    : prompt;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return {
      analysis: analyzeRequestOffline(prompt),
      source: 'DETERMINISTIC_OFFLINE',
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contextualPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.1,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    const parsed = JSON.parse(text) as AIIntentAnalysis;
    parsed.rawPrompt = prompt;
    if (!parsed.requestId) {
      parsed.requestId = generateId('REQ');
    }
    return {
      analysis: parsed,
      source: 'GEMINI_3_6_FLASH',
    };
  } catch (error) {
    console.warn('Gemini API call failed or quota reached, falling back to offline engine:', error);
    return {
      analysis: analyzeRequestOffline(prompt),
      source: 'DETERMINISTIC_OFFLINE',
    };
  }
}
