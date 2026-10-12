import Link from 'next/link';
import {
  ArrowRight,
  Check,
  FileCheck2,
  GitBranch,
  LockKeyhole,
  Play,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';

const steps = [
  {
    icon: Sparkles,
    title: 'Describe the request',
    text: 'Turn a ticket, alert, or executive message into structured operational intent.',
  },
  {
    icon: GitBranch,
    title: 'Plan the workflow',
    text: 'Generate a connected execution graph with policy checks and connector actions.',
  },
  {
    icon: Play,
    title: 'Run with control',
    text: 'Execute deterministic steps, pause for approval, and record every transition.',
  },
  {
    icon: FileCheck2,
    title: 'Prove what happened',
    text: 'Keep a tamper-evident audit trail for operators, reviewers, and compliance teams.',
  },
];

const capabilities = [
  'AI-assisted intake for messy business requests',
  'Deterministic FSM execution instead of opaque automation',
  'Human authorization gates for sensitive actions',
  'Connector-ready workflows across enterprise systems',
  'Cryptographic event history for every decision',
];

export default function HomePage() {
  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#F9F8F6] text-[#5A4A42]">
      <nav className="mx-auto flex min-h-[72px] max-w-7xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 py-3 sm:h-[72px] sm:flex-nowrap sm:px-8 sm:py-0">
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-3" aria-label="Apex Operations home">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-[#5A4A42] text-[#F9F8F6] shadow-sm">
            <Workflow className="h-4 w-4" />
          </span>
          <span className="truncate text-sm font-black tracking-[0.16em] text-[#5A4A42]">APEX OPERATIONS</span>
        </Link>

        <div className="hidden items-center gap-7 text-sm font-medium text-[#7A6A62] md:flex">
          <a href="#platform" className="transition-colors hover:text-[#5A4A42]">Platform</a>
          <a href="#controls" className="transition-colors hover:text-[#5A4A42]">Controls</a>
          <a href="#workflow" className="transition-colors hover:text-[#5A4A42]">How it works</a>
        </div>

        <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
          <Link href="/login" className="inline-flex min-h-11 items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold text-[#7A6A62] transition-colors hover:bg-[#EFE9E3] hover:text-[#5A4A42]">
            Sign in
          </Link>
          <Link href="/signup" className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-[#5A4A42] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:gap-2 sm:px-4">
            <span className="sm:hidden">Sign up</span>
            <span className="hidden sm:inline">Create account</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 pb-20 pt-12 sm:px-8 md:pb-28 md:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div className="max-w-2xl">
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A8A82]">Operational intelligence with a control plane</p>
          <h1 className="max-w-xl text-4xl font-black leading-[1.04] tracking-[-0.045em] text-[#5A4A42] sm:text-5xl lg:text-[4.35rem]">
            Move work forward without losing control.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#7A6A62] sm:text-lg">
            Apex Operations turns business requests into governed, auditable workflows that teams can run with confidence.
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#5A4A42] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(90,74,66,0.16)] transition-transform hover:-translate-y-0.5 active:translate-y-0">
              Start with your workspace <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#C9B59C] bg-white/60 px-5 py-3 text-sm font-bold text-[#5A4A42] transition-colors hover:bg-[#EFE9E3]">
              View the command center
            </Link>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-[#9A8A82]">
            <span className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#8B9D83]" /> Policy-aware execution</span>
            <span className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#8B9D83]" /> Human approval gates</span>
            <span className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#8B9D83]" /> Evidence by default</span>
          </div>
        </div>

        <div className="relative min-h-[420px] rounded-[28px] border border-[#C9B59C]/60 bg-[#EFE9E3] p-5 shadow-[0_24px_80px_rgba(90,74,66,0.1)] sm:p-7">
          <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-[#D9CFC7] blur-2xl" />
          <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-[#C9B59C]/30 blur-2xl" />
          <div className="relative flex h-full flex-col justify-between rounded-2xl border border-white/80 bg-white/80 p-5 backdrop-blur-sm sm:p-6">
            <div className="flex items-center justify-between border-b border-[#D9CFC7] pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9A8A82]">Live orchestration</p>
                <p className="mt-1 text-sm font-bold text-[#5A4A42]">Customer credit exception</p>
              </div>
              <span className="rounded-full border border-[#8B9D83]/40 bg-[#8B9D83]/10 px-2.5 py-1 text-[10px] font-bold text-[#66795f]">Running</span>
            </div>

            <div className="space-y-3 py-7">
              <div className="flex items-center gap-3 rounded-xl border border-[#D9CFC7] bg-[#F9F8F6] p-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#A0B4B7]/20 text-[#647c80]"><Sparkles className="h-4 w-4" /></span>
                <div className="flex-1"><p className="text-xs font-bold text-[#5A4A42]">Intent classified</p><p className="mt-0.5 text-[11px] text-[#9A8A82]">Priority and policy extracted</p></div>
                <Check className="h-4 w-4 text-[#8B9D83]" />
              </div>
              <div className="ml-8 h-4 border-l border-dashed border-[#C9B59C]" />
              <div className="flex items-center gap-3 rounded-xl border border-[#C9B59C] bg-[#EFE9E3] p-3 shadow-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C9B59C]/50 text-[#5A4A42]"><GitBranch className="h-4 w-4" /></span>
                <div className="flex-1"><p className="text-xs font-bold text-[#5A4A42]">Approval checkpoint</p><p className="mt-0.5 text-[11px] text-[#7A6A62]">VP Support review required</p></div>
                <LockKeyhole className="h-4 w-4 text-[#a17e5e]" />
              </div>
              <div className="ml-8 h-4 border-l border-dashed border-[#C9B59C]" />
              <div className="flex items-center gap-3 rounded-xl border border-[#D9CFC7] bg-[#F9F8F6] p-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8B9D83]/20 text-[#66795f]"><FileCheck2 className="h-4 w-4" /></span>
                <div className="flex-1"><p className="text-xs font-bold text-[#5A4A42]">Audit event prepared</p><p className="mt-0.5 text-[11px] text-[#9A8A82]">Decision and payload linked</p></div>
                <ShieldCheck className="h-4 w-4 text-[#8B9D83]" />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#D9CFC7] pt-4 text-[10px] font-mono text-[#9A8A82]">
              <span>FSM / CUSTOMER_OPS</span><span>Evidence chain active</span>
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="border-y border-[#D9CFC7] bg-white/35">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-16 sm:px-8 md:grid-cols-[0.8fr_1.2fr] md:py-20">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A8A82]">The platform</p>
            <h2 className="mt-4 max-w-sm text-3xl font-black leading-tight tracking-[-0.04em] text-[#5A4A42]">One place to turn intent into accountable action.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {capabilities.map((capability) => (
              <div key={capability} className="flex items-start gap-3 border-b border-[#D9CFC7] pb-4 text-sm leading-6 text-[#7A6A62]">
                <Check className="mt-1 h-4 w-4 flex-none text-[#8B9D83]" />
                <span>{capability}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A8A82]">How it works</p>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#5A4A42] sm:text-4xl">Automation that stays explainable.</h2>
          <p className="mt-4 text-base leading-7 text-[#7A6A62]">Every request follows a visible path from intake to outcome, with the right people involved when policy says they should be.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-0 border-t border-[#C9B59C] sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="border-b border-[#D9CFC7] py-7 sm:border-r sm:px-6 lg:border-b-0 lg:first:pl-0 lg:last:border-r-0">
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-[#5A4A42]" />
                  <span className="text-xs font-mono text-[#9A8A82]">0{index + 1}</span>
                </div>
                <h3 className="mt-8 text-base font-bold text-[#5A4A42]">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#7A6A62]">{step.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="controls" className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 md:pb-28">
        <div className="grid grid-cols-1 items-end gap-8 rounded-[28px] bg-[#5A4A42] p-8 text-[#F9F8F6] sm:p-12 md:grid-cols-[1fr_auto]">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D9CFC7]">Built for consequential work</p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl">Give every operational decision a clear next step.</h2>
            <p className="mt-4 text-sm leading-6 text-[#EFE9E3]">Create a workspace, explore the Command Center, and see how governed automation fits your operating model.</p>
          </div>
          <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F9F8F6] px-5 py-3 text-sm font-bold text-[#5A4A42] transition-transform hover:-translate-y-0.5 active:translate-y-0">
            Create your account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#D9CFC7] px-5 py-7 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-[#9A8A82] sm:flex-row sm:items-center sm:justify-between">
          <span className="font-bold tracking-[0.16em] text-[#7A6A62]">APEX OPERATIONS</span>
          <span>Governed workflow orchestration for modern operations teams.</span>
        </div>
      </footer>
    </main>
  );
}
