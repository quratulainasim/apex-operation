'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  MailCheck,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import { createAccount, login } from '@/lib/auth';
import { sanitizeRedirectPath } from '@/lib/utils';

type AuthMode = 'login' | 'signup';

interface AuthFormProps {
  mode: AuthMode;
  nextPath?: string;
  initialError?: string;
}

function getInitialError(error?: string) {
  if (error === 'config') {
    return 'Supabase authentication is not configured. Add the public Supabase URL and anon key to .env.local.';
  }

  if (error === 'confirmation') {
    return 'That confirmation link is invalid or expired. Request a new one or sign in again.';
  }

  return '';
}

export function AuthForm({ mode, nextPath = '/dashboard', initialError }: AuthFormProps) {
  const router = useRouter();
  const isSignup = mode === 'signup';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(() => getInitialError(initialError));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setConfirmationSent(false);
    setIsSubmitting(true);

    try {
      if (isSignup) {
        const result = await createAccount({ name, email, password, confirmPassword, nextPath });
        if (result.needsEmailConfirmation) {
          setConfirmationSent(true);
          return;
        }
      } else {
        await login({ email, password });
      }

      router.replace(sanitizeRedirectPath(nextPath));
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to complete authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-[100dvh] bg-[#F9F8F6] px-5 py-8 text-[#5A4A42] sm:px-8">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-[#C9B59C]/60 bg-white shadow-[0_24px_80px_rgba(90,74,66,0.1)] lg:grid-cols-[0.9fr_1.1fr]">
          <section className="relative hidden overflow-hidden bg-[#5A4A42] p-10 text-[#F9F8F6] lg:flex lg:flex-col lg:justify-between">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#C9B59C]/25 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#D9CFC7]/20 blur-3xl" />
            <div className="relative">
              <Link href="/" className="inline-flex items-center gap-3 text-sm font-black tracking-[0.16em]">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F9F8F6] text-[#5A4A42]"><Workflow className="h-4 w-4" /></span>
                APEX OPERATIONS
              </Link>
              <h1 className="mt-24 max-w-sm text-4xl font-black leading-tight tracking-[-0.04em]">A clearer path from request to result.</h1>
              <p className="mt-5 max-w-sm text-sm leading-6 text-[#EFE9E3]">Bring intake, execution, approvals, and evidence into one operational control plane.</p>
            </div>
            <div className="relative space-y-3 text-sm text-[#EFE9E3]">
              <div className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-[#C9B59C]" /> Deterministic workflow execution</div>
              <div className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-[#C9B59C]" /> Human review where policy requires it</div>
              <div className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-[#C9B59C]" /> Audit evidence attached to every step</div>
            </div>
          </section>

          <section className="p-6 sm:p-10 lg:p-14">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#9A8A82] transition-colors hover:text-[#5A4A42]">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to home
            </Link>

            <div className="mt-10 max-w-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFE9E3] text-[#5A4A42]">
                {isSignup ? <Workflow className="h-5 w-5" /> : <LockKeyhole className="h-5 w-5" />}
              </div>
              <h2 className="mt-6 text-3xl font-black tracking-[-0.04em] text-[#5A4A42]">{isSignup ? 'Create your workspace' : 'Welcome back'}</h2>
              <p className="mt-2 text-sm leading-6 text-[#7A6A62]">
                {isSignup ? 'Create a secure Supabase account to explore governed operations.' : 'Sign in to open your operational command center.'}
              </p>

              {confirmationSent ? (
                <div className="mt-8 rounded-2xl border border-[#8B9D83]/40 bg-[#8B9D83]/10 p-5" role="status">
                  <div className="flex items-start gap-3">
                    <MailCheck className="mt-0.5 h-5 w-5 flex-none text-[#66795F]" />
                    <div>
                      <h3 className="font-bold text-[#5A4A42]">Check your email</h3>
                      <p className="mt-1 text-sm leading-6 text-[#7A6A62]">
                        Supabase sent a confirmation link to <strong>{email.trim().toLowerCase()}</strong>. Open it to activate your account, then sign in here.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {isSignup && (
                  <label className="block space-y-2 text-sm font-semibold text-[#5A4A42]">
                    Full name
                    <input
                      required
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Jordan Lee"
                      className="h-11 w-full rounded-lg border border-[#C9B59C] bg-[#F9F8F6] px-3 text-base font-normal text-[#5A4A42] outline-none transition-colors placeholder:text-[#9A8A82] focus:border-[#5A4A42] focus:ring-2 focus:ring-[#C9B59C]/40 sm:text-sm"
                    />
                  </label>
                )}

                <label className="block space-y-2 text-sm font-semibold text-[#5A4A42]">
                  Work email
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    className="h-11 w-full rounded-lg border border-[#C9B59C] bg-[#F9F8F6] px-3 text-base font-normal text-[#5A4A42] outline-none transition-colors placeholder:text-[#9A8A82] focus:border-[#5A4A42] focus:ring-2 focus:ring-[#C9B59C]/40 sm:text-sm"
                  />
                </label>

                <label className="block space-y-2 text-sm font-semibold text-[#5A4A42]">
                  Password
                  <input
                    required
                    type="password"
                    minLength={8}
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    className="h-11 w-full rounded-lg border border-[#C9B59C] bg-[#F9F8F6] px-3 text-base font-normal text-[#5A4A42] outline-none transition-colors placeholder:text-[#9A8A82] focus:border-[#5A4A42] focus:ring-2 focus:ring-[#C9B59C]/40 sm:text-sm"
                  />
                </label>

                {isSignup && (
                  <label className="block space-y-2 text-sm font-semibold text-[#5A4A42]">
                    Confirm password
                    <input
                      required
                      type="password"
                      minLength={8}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Repeat your password"
                      className="h-11 w-full rounded-lg border border-[#C9B59C] bg-[#F9F8F6] px-3 text-base font-normal text-[#5A4A42] outline-none transition-colors placeholder:text-[#9A8A82] focus:border-[#5A4A42] focus:ring-2 focus:ring-[#C9B59C]/40 sm:text-sm"
                    />
                  </label>
                )}

                {error && (
                  <p role="alert" className="rounded-lg border border-[#C97B7B]/40 bg-[#C97B7B]/10 px-3 py-2.5 text-sm leading-5 text-[#965b5b]">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#5A4A42] px-4 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60"
                >
                  {isSubmitting ? (isSignup ? 'Creating account...' : 'Signing in...') : isSignup ? 'Create account' : 'Sign in'}
                  {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                </button>
                </form>
              )}

              <div className="mt-7 flex items-center gap-2 text-xs leading-5 text-[#9A8A82]">
                <ShieldCheck className="h-4 w-4 flex-none text-[#8B9D83]" />
                Supabase Auth securely manages your password and session.
              </div>

              <p className="mt-8 text-center text-sm text-[#7A6A62]">
                {isSignup ? 'Already have an account?' : 'New to Apex Operations?'}{' '}
                <Link
                  href={{
                    pathname: isSignup ? '/login' : '/signup',
                    query: nextPath !== '/dashboard' ? { next: nextPath } : undefined,
                  }}
                  className="font-bold text-[#5A4A42] underline decoration-[#C9B59C] underline-offset-4 hover:text-[#7A6A62]"
                >
                  {isSignup ? 'Sign in' : 'Create an account'}
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
