import { AuthForm } from '@/components/auth/auth-form';
import { sanitizeRedirectPath } from '@/lib/utils';

interface LoginPageProps {
  searchParams: Promise<{ next?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = sanitizeRedirectPath(params.next);

  return <AuthForm mode="login" nextPath={nextPath} initialError={params.error} />;
}
