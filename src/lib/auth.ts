'use client';

import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { sanitizeRedirectPath } from '@/lib/utils';

export interface AuthSession {
  userId: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResult {
  session: AuthSession | null;
  needsEmailConfirmation: boolean;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function mapAuthError(error: { message?: string }) {
  const message = error.message?.trim() || 'Unable to complete authentication.';
  const normalized = message.toLowerCase();

  if (normalized.includes('invalid login credentials')) {
    return new Error('The email or password is incorrect.');
  }

  if (normalized.includes('email not confirmed')) {
    return new Error('Confirm your email address before signing in.');
  }

  if (normalized.includes('user already registered')) {
    return new Error('An account with this email already exists.');
  }

  if (normalized.includes('password')) {
    return new Error('Supabase rejected this password. Use at least 8 characters and try again.');
  }

  if (normalized.includes('rate limit') || normalized.includes('email rate limit exceeded') || normalized.includes('too many requests')) {
    return new Error('Supabase temporarily limited email delivery. Wait a few minutes before trying again, or use an existing confirmed account to sign in.');
  }

  if (normalized.includes('failed to fetch') || normalized.includes('network')) {
    return new Error('Unable to reach Supabase. Check your connection and Supabase environment variables.');
  }

  return new Error(message);
}

function toAuthSession(user: User): AuthSession {
  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  const metadataName = metadata?.name || metadata?.full_name;

  return {
    userId: user.id,
    name: typeof metadataName === 'string' && metadataName.trim() ? metadataName.trim() : user.email || 'Workspace member',
    email: user.email || '',
    createdAt: user.created_at,
  };
}

function validateEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);
  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
    throw new Error('Enter a valid work email address.');
  }

  return normalizedEmail;
}

export async function createAccount(input: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  nextPath?: string;
}): Promise<AuthResult> {
  const name = input.name.trim();
  if (name.length < 2) {
    throw new Error('Enter your full name.');
  }

  const email = validateEmail(input.email);
  if (input.password.length < 8) {
    throw new Error('Use at least 8 characters for your password.');
  }

  if (input.password !== input.confirmPassword) {
    throw new Error('Passwords do not match.');
  }

  const callbackUrl = new URL('/auth/callback', window.location.origin);
  callbackUrl.searchParams.set('next', sanitizeRedirectPath(input.nextPath));

  const { data, error } = await createClient().auth.signUp({
    email,
    password: input.password,
    options: {
      data: { name },
      emailRedirectTo: callbackUrl.toString(),
    },
  });

  if (error) {
    throw mapAuthError(error);
  }

  if (!data.user) {
    throw new Error('Supabase did not return a user for this account.');
  }

  if (data.user.identities?.length === 0) {
    throw new Error('An account with this email already exists.');
  }

  return {
    session: data.session ? toAuthSession(data.user) : null,
    needsEmailConfirmation: !data.session,
  };
}

export async function login(input: { email: string; password: string }): Promise<AuthSession> {
  const email = validateEmail(input.email);
  if (!input.password) {
    throw new Error('Enter your password.');
  }

  const { data, error } = await createClient().auth.signInWithPassword({
    email,
    password: input.password,
  });

  if (error) {
    throw mapAuthError(error);
  }

  if (!data.user) {
    throw new Error('Supabase did not return a user for this sign-in.');
  }

  return toAuthSession(data.user);
}

export async function getCurrentSession(): Promise<AuthSession | null> {
  const { data } = await createClient().auth.getUser();
  return data.user ? toAuthSession(data.user) : null;
}

export async function logout() {
  const { error } = await createClient().auth.signOut();
  if (error) {
    throw mapAuthError(error);
  }
}
