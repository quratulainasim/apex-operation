import { AuthForm } from '@/components/auth/auth-form';
import { sanitizeRedirectPath } from '@/lib/utils';

interface SignupPageProps {
  searchParams: Promise<{ next?: string; error?: string }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const nextPath = sanitizeRedirectPath(params.next);

  return <AuthForm mode="signup" nextPath={nextPath} initialError={params.error} />;
}
