import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getSupabaseConfig } from '@/lib/supabase/config';
import { sanitizeRedirectPath } from '@/lib/utils';

const protectedPaths = ['/dashboard', '/intake', '/workflows', '/approvals', '/audit', '/api/ai/analyze'];
const authPaths = ['/login', '/signup'];

function matchesPath(pathname: string, paths: string[]) {
  return paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isProtectedPath = matchesPath(pathname, protectedPaths);
  const isAuthPath = matchesPath(pathname, authPaths);

  if (!isProtectedPath && !isAuthPath) {
    return NextResponse.next();
  }

  const config = getSupabaseConfig();
  if (!config) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Authentication is not configured.' }, { status: 503 });
    }

    if (isAuthPath) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/login?error=config', request.url));
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (isProtectedPath && !user) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', sanitizeRedirectPath(`${pathname}${search}`));
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/intake/:path*', '/workflows/:path*', '/approvals/:path*', '/audit/:path*', '/api/ai/analyze', '/login', '/signup'],
};
