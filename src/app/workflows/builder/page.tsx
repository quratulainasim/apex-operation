'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Layers,
  Plus,
  Trash2,
  Play,
  Database,
  ShieldCheck,
  Sparkles,
  Bell,
  CheckCircle2,
  Radio,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkflowNode, WorkflowEdge, WorkflowTemplate, EnterpriseService, NodeType } from '@/types/workflow';
import { useWorkflowStore } from '@/lib/store/use-workflow-store';
import { createInstanceFromTemplate } from '@/lib/presets/scenarios';
import { toast } from 'sonner';

export default function WorkflowBuilderPage() {
  const router = useRouter();

  const [workflowTitle, setWorkflowTitle] = useState('Custom Enterprise Reconciliation DAG');
  const [workflowCategory, setWorkflowCategory] = useState('Financial Operations');
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: 'node-1',
      name: 'Webhook Request Intake',
      type: 'TRIGGER',
      service: 'INTERNAL_ENGINE',
      action: 'ingest_webhook',
      inputPayloadTemplate: { endpoint: '/api/v1/intake/custom', hmacVerified: true },
      status: 'IDLE',
      description: 'Ingests inbound payload with HMAC SHA-256 header validation',
      position: { x: 50, y: 150 },
    },
    {
      id: 'node-2',
      name: 'SAP S/4HANA Ledger Query',
      type: 'INTEGRATION_ACTION',
      service: 'SAP',
      action: 'query_gl_account',
      inputPayloadTemplate: { glAccount: 'GL-400192', currency: 'USD' },
      status: 'IDLE',
      description: 'Cross-checks invoice metadata with SAP GL accounts',
      position: { x: 300, y: 150 },
    },
    {
      id: 'node-3',
      name: 'CFO Compliance Sign-Off',
      type: 'HUMAN_APPROVAL',
      service: 'INTERNAL_ENGINE',
      action: 'human_authorization_gate',
      inputPayloadTemplate: { thresholdUsd: 10000, approverRole: 'CFO' },
      approvalConfig: {
        approverRole: 'CFO',
        timeoutMinutes: 120,
        reasonRequired: true,
        policyRule: 'Policy FIN-402: Ledger adjustments exceeding $10,000 USD require CFO authorization.',
      },
      status: 'IDLE',
      description: 'Halts for executive approval if variance > $10,000 USD',
      position: { x: 550, y: 150 },
    },
    {
      id: 'node-4',
      name: 'Slack Executive Notification',
      type: 'NOTIFICATION',
      service: 'SLACK',
      action: 'dispatch_channel_alert',
      inputPayloadTemplate: { channel: '#finance-ops', mentionRole: '@finance-team' },
      status: 'IDLE',
      description: 'Dispatches signed audit confirmation to #finance-ops',
      position: { x: 800, y: 150 },
    },
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-2');
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const handleAddNode = (type: NodeType, name: string, service: EnterpriseService, action: string) => {
    const newId = `node-${nodes.length + 1}`;
    const lastNode = nodes[nodes.length - 1];
    const newX = lastNode ? lastNode.position.x + 240 : 50;
    const newY = 150;

    const newNode: WorkflowNode = {
      id: newId,
      name,
      type,
      service,
      action,
      inputPayloadTemplate: {},
      status: 'IDLE',
      description: `Configured ${name} step in deterministic DAG`,
      position: { x: newX, y: newY },
      approvalConfig:
        type === 'HUMAN_APPROVAL'
          ? {
              approverRole: 'CFO',
              timeoutMinutes: 60,
              reasonRequired: true,
              policyRule: 'Automated governance compliance policy trigger.',
            }
          : undefined,
    };

    setNodes([...nodes, newNode]);
    setSelectedNodeId(newId);
    toast.success(`Added node ${name} to DAG.`);
  };

  const handleDeleteNode = (nodeId: string) => {
    if (nodes.length <= 1) {
      toast.error('Workflow must contain at least one node.');
      return;
    }
    setNodes(nodes.filter((n) => n.id !== nodeId));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(nodes[0].id);
    }
    toast.info(`Removed node ${nodeId}.`);
  };

  const handleDeployAndRun = () => {
    const template: WorkflowTemplate = {
      id: `WF-CUSTOM-${Date.now().toString().slice(-4)}`,
      title: workflowTitle,
      description: 'Custom built workflow DAG from visual builder.',
      category: workflowCategory,
      version: '1.0.0',
      estimatedDuration: '2.5s (Simulated)',
      successRate: 99.1,
      executionCount: 1,
      tags: ['Custom', 'Visual Builder'],
      nodes,
      edges: nodes.slice(0, -1).map((n, i) => ({
        id: `edge-${n.id}-${nodes[i + 1].id}`,
        sourceNodeId: n.id,
        targetNodeId: nodes[i + 1].id,
        status: 'INACTIVE',
      })),
      defaultVariables: {},
    };

    const newInstance = createInstanceFromTemplate(template);
    useWorkflowStore.setState((s) => ({
      instances: [newInstance, ...s.instances],
      activeInstanceId: newInstance.id,
    }));

    toast.success(`Deployed custom DAG instance: ${newInstance.id}`);
    router.push(`/workflows/${newInstance.id}`);
  };

  return (
    <div className="mx-auto flex min-h-0 max-w-7xl flex-col space-y-4 lg:h-[calc(100dvh-8.5rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50/90 border border-gray-200 shadow-xl flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-600">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <input
              type="text"
              value={workflowTitle}
              onChange={(e) => setWorkflowTitle(e.target.value)}
              className="text-base font-bold text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:border-cyan-400 focus:outline-none font-mono"
            />
            <p className="text-xs text-gray-600 mt-0.5">
              Visual Structural DAG Designer & Node Configurator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleDeployAndRun}
            className="bg-blue-600 hover:bg-blue-500 text-slate-950 font-bold gap-1.5 text-xs shadow-lg shadow-blue-500/20 h-9"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Deploy & Test Execution</span>
          </Button>
        </div>
      </div>

      {/* Main Builder Grid */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left: Node Palette (3 Cols) */}
        <div className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50/90 p-4 shadow-xl lg:col-span-3 lg:overflow-y-auto">
          <span className="text-xs font-bold text-gray-900 uppercase font-mono tracking-wider block">
            Add Node to DAG
          </span>

          {/* Trigger Palette */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-gray-600 uppercase">Triggers & AI</span>
            <button
              onClick={() =>
                handleAddNode('TRIGGER', 'Inbound Webhook Intake', 'INTERNAL_ENGINE', 'ingest_webhook')
              }
              className="w-full text-left p-2 rounded-lg bg-white border border-gray-200 hover:border-blue-500/40 text-xs text-gray-800 flex items-center justify-between group"
            >
              <span>Webhook Intake</span>
              <Plus className="w-3.5 h-3.5 text-blue-600" />
            </button>
            <button
              onClick={() =>
                handleAddNode('AI_TRANSFORM', 'Gemini Reasoning Node', 'INTERNAL_ENGINE', 'gemini_intent_extraction')
              }
              className="w-full text-left p-2 rounded-lg bg-white border border-gray-200 hover:border-blue-500/40 text-xs text-gray-800 flex items-center justify-between group"
            >
              <span>Gemini AI Reasoner</span>
              <Plus className="w-3.5 h-3.5 text-blue-600" />
            </button>
          </div>

          {/* Connectors Palette */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-gray-600 uppercase">
              Enterprise Connectors
            </span>
            <button
              onClick={() =>
                handleAddNode('INTEGRATION_ACTION', 'Salesforce CRM Mutation', 'SALESFORCE', 'query_account_entitlement')
              }
              className="w-full text-left p-2 rounded-lg bg-white border border-gray-200 hover:border-blue-500/40 text-xs text-gray-800 flex items-center justify-between group"
            >
              <span>Salesforce CRM</span>
              <Plus className="w-3.5 h-3.5 text-blue-600" />
            </button>
            <button
              onClick={() =>
                handleAddNode('INTEGRATION_ACTION', 'SAP S/4HANA PO Match', 'SAP', 'query_gl_account')
              }
              className="w-full text-left p-2 rounded-lg bg-white border border-gray-200 hover:border-blue-500/40 text-xs text-gray-800 flex items-center justify-between group"
            >
              <span>SAP S/4HANA ERP</span>
              <Plus className="w-3.5 h-3.5 text-blue-600" />
            </button>
            <button
              onClick={() =>
                handleAddNode('INTEGRATION_ACTION', 'Jira Cloud Ticket', 'JIRA', 'create_issue')
              }
              className="w-full text-left p-2 rounded-lg bg-white border border-gray-200 hover:border-blue-500/40 text-xs text-gray-800 flex items-center justify-between group"
            >
              <span>Jira Software</span>
              <Plus className="w-3.5 h-3.5 text-blue-600" />
            </button>
            <button
              onClick={() =>
                handleAddNode('INTEGRATION_ACTION', 'Stripe Ledger Credit', 'STRIPE', 'issue_credit_balance')
              }
              className="w-full text-left p-2 rounded-lg bg-white border border-gray-200 hover:border-blue-500/40 text-xs text-gray-800 flex items-center justify-between group"
            >
              <span>Stripe Billing</span>
              <Plus className="w-3.5 h-3.5 text-blue-600" />
            </button>
            <button
              onClick={() =>
                handleAddNode('INTEGRATION_ACTION', 'AWS IAM Revocation', 'AWS', 'revoke_iam_policy')
              }
              className="w-full text-left p-2 rounded-lg bg-white border border-gray-200 hover:border-blue-500/40 text-xs text-gray-800 flex items-center justify-between group"
            >
              <span>AWS Cloud Security</span>
              <Plus className="w-3.5 h-3.5 text-blue-600" />
            </button>
          </div>

          {/* Governance & Logic Palette */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-gray-600 uppercase">
              Human Gates & Safety
            </span>
            <button
              onClick={() =>
                handleAddNode('HUMAN_APPROVAL', 'Executive Policy Gate', 'INTERNAL_ENGINE', 'human_authorization_gate')
              }
              className="w-full text-left p-2 rounded-lg bg-white border border-amber-500/30 hover:border-amber-500/60 text-xs text-amber-200 flex items-center justify-between group"
            >
              <span>Human Approval Gate</span>
              <Plus className="w-3.5 h-3.5 text-amber-400" />
            </button>
            <button
              onClick={() =>
                handleAddNode('NOTIFICATION', 'Slack Alert Broadcast', 'SLACK', 'dispatch_channel_alert')
              }
              className="w-full text-left p-2 rounded-lg bg-white border border-gray-200 hover:border-blue-500/40 text-xs text-gray-800 flex items-center justify-between group"
            >
              <span>Slack Broadcast</span>
              <Plus className="w-3.5 h-3.5 text-blue-600" />
            </button>
          </div>
        </div>

        {/* Center: Interactive Sequence Pipeline (6 Cols) */}
        <div className="flex flex-col items-center space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl sm:p-6 lg:col-span-6 lg:overflow-y-auto">
          <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            Topological DAG Execution Chain ({nodes.length} Steps)
          </span>

          {nodes.map((node, index) => {
            const isSelected = selectedNodeId === node.id;
            const isApproval = node.type === 'HUMAN_APPROVAL';

            return (
              <React.Fragment key={node.id}>
                {/* Node Card */}
                <div
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`w-full max-w-md rounded-xl border p-4 cursor-pointer transition-all touch-manipulation active:scale-[0.99] ${
                    isSelected
                      ? isApproval
                        ? 'border-amber-500 ring-2 ring-amber-500/20 bg-gray-50'
                        : 'border-cyan-400 ring-2 ring-cyan-500/20 bg-gray-50'
                      : 'border-gray-200 bg-white/80 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-blue-600 font-bold">
                      Step {index + 1}: {node.id}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase font-bold ${
                        isApproval
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-gray-100 text-gray-700 border-gray-300'
                      }`}
                    >
                      {node.type}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-gray-900">{node.name}</h4>
                  <p className="text-xs text-gray-600 mt-0.5 truncate">{node.description}</p>
                </div>

                {/* Connector Arrow */}
                {index < nodes.length - 1 && (
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-6 bg-gray-200" />
                    <div className="w-2 h-2 rotate-45 border-b-2 border-r-2 border-cyan-400 -mt-1" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: Selected Node Property Inspector (3 Cols) */}
        <div className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50/90 p-4 shadow-xl lg:col-span-3 lg:overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <span className="text-xs font-bold text-gray-900 uppercase font-mono tracking-wider">
              Node Inspector
            </span>
            {selectedNode && (
              <button
                onClick={() => handleDeleteNode(selectedNode.id)}
                className="text-rose-400 hover:text-rose-300 p-1 hover:bg-gray-100 rounded"
                title="Delete Node"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {selectedNode ? (
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-600 uppercase">Node ID:</label>
                <input
                  type="text"
                  disabled
                  value={selectedNode.id}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-mono text-gray-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-600 uppercase">Name:</label>
                <input
                  type="text"
                  value={selectedNode.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNodes(nodes.map((n) => (n.id === selectedNode.id ? { ...n, name: val } : n)));
                  }}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs font-sans text-gray-800 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-600 uppercase">
                  Description:
                </label>
                <textarea
                  rows={2}
                  value={selectedNode.description}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNodes(
                      nodes.map((n) => (n.id === selectedNode.id ? { ...n, description: val } : n))
                    );
                  }}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs font-sans text-gray-800 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              {selectedNode.type === 'HUMAN_APPROVAL' && (
                <div className="space-y-1 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <label className="text-[10px] font-mono text-amber-300 uppercase font-semibold">
                    Signing Authority Role:
                  </label>
                  <select
                    value={selectedNode.approvalConfig?.approverRole || 'VP_SUPPORT'}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setNodes(
                        nodes.map((n) =>
                          n.id === selectedNode.id
                            ? {
                                ...n,
                                approvalConfig: {
                                  approverRole: val,
                                  timeoutMinutes: 60,
                                  reasonRequired: true,
                                  policyRule: 'Executive policy sign-off required.',
                                },
                              }
                            : n
                        )
                      );
                    }}
                    className="w-full bg-white border border-amber-500/40 text-xs font-mono text-amber-200 p-1.5 rounded-lg focus:outline-none"
                  >
                    <option value="VP_SUPPORT">VP Support & Accounts</option>
                    <option value="CFO">Chief Financial Officer (CFO)</option>
                    <option value="CISO">Chief Info Security Officer (CISO)</option>
                    <option value="DEVOPS_LEAD">DevOps Lead Engineer</option>
                    <option value="OPERATIONS_MANAGER">Operations Manager</option>
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-600 uppercase">
                  Input Payload Template (JSON):
                </label>
                <pre className="p-2 bg-white rounded border border-gray-200 text-[10px] font-mono text-blue-500 overflow-x-auto">
                  {JSON.stringify(selectedNode.inputPayloadTemplate || {}, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-gray-500 font-mono">
              Click a node in the DAG to inspect and configure properties.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
