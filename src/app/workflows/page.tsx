'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Library,
  Layers,
  Sparkles,
  Play,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  SlidersHorizontal,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkflowStore } from '@/lib/store/use-workflow-store';
import { ENTERPRISE_WORKFLOW_TEMPLATES } from '@/lib/presets/scenarios';
import { toast } from 'sonner';

export default function WorkflowCatalogPage() {
  const router = useRouter();
  const launchTemplateInstance = useWorkflowStore((s) => s.launchTemplateInstance);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    { label: 'All Workflows', value: 'ALL' },
    { label: 'Customer Ops', value: 'CUSTOMER_OPS' },
    { label: 'Finance & ERP', value: 'FINANCE' },
    { label: 'Security & IAM', value: 'SECURITY' },
    { label: 'Cloud & DevOps', value: 'INFRASTRUCTURE' },
    { label: 'Procurement & IT', value: 'PROCUREMENT' },
  ];

  const handleLaunch = (templateId: string) => {
    const newId = launchTemplateInstance(templateId);
    toast.success(`Workflow instance ${newId} initialized.`);
    router.push(`/workflows/${newId}`);
  };

  const filteredTemplates = ENTERPRISE_WORKFLOW_TEMPLATES.filter((tpl) => {
    const matchesSearch =
      tpl.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tpl.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' || tpl.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Library className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight font-mono">
              Enterprise Workflow Catalog
            </h1>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Pre-audited, deterministic enterprise DAG templates with automated policy compliance and
            connector wiring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/workflows/builder">
            <Button className="bg-blue-600 hover:bg-blue-500 text-slate-950 font-bold gap-2 text-xs shadow-lg shadow-blue-500/20">
              <Plus className="w-4 h-4" />
              <span>New Workflow Builder</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/80 p-3 rounded-xl border border-gray-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search templates by name, ERP, or SLA..."
            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-800 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setSelectedCategory(c.value)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                selectedCategory === c.value
                  ? 'bg-blue-600/20 text-blue-500 font-bold border border-blue-500/30'
                  : 'bg-white text-gray-600 hover:text-gray-800 border border-gray-200/80'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => {
          const hasApprovalGate = template.nodes.some((n) => n.type === 'HUMAN_APPROVAL');

          return (
            <div
              key={template.id}
              className="p-5 rounded-2xl bg-gray-50/90 border border-gray-200/90 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-4 shadow-xl group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-blue-600 border border-gray-200 font-bold">
                    {template.id}
                  </span>
                  {hasApprovalGate && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" />
                      <span>Human Gate</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-cyan-200 transition-colors">
                    {template.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>
                </div>

                {/* Node step tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {template.nodes.map((node) => (
                    <span
                      key={node.id}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white text-gray-600 border border-gray-200/80"
                    >
                      {node.type === 'INTEGRATION_ACTION'
                        ? node.service || node.name
                        : node.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Metrics and Launch Button */}
              <div className="pt-3 border-t border-gray-200/80 flex items-center justify-between gap-3 text-xs font-mono">
                <div className="space-y-0.5">
                  <div className="text-[10px] text-gray-500">
                    Steps: <strong className="text-gray-700">{template.nodes.length}</strong> • Target SLA: <strong className="text-emerald-400">30m</strong>
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Success Rate: <strong className="text-emerald-400">99.4%</strong>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleLaunch(template.id)}
                  className="bg-blue-600 hover:bg-blue-500 text-slate-950 font-bold gap-1.5 text-xs shadow-md shadow-blue-500/10 h-8"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
