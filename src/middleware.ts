import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { headers } = request;
  const host = headers.get('host');
  const isHttps = headers.get('x-forwarded-proto') === 'https' || process.env.NODE_ENV === 'development';

  // Rediriger www vers non-www et http vers https
  if (host?.startsWith('www.') || !isHttps) {
    const newHost = host?.replace('www.', '');
    const protocol = 'https';
    const newUrl = new URL(request.nextUrl.pathname, `${protocol}://${newHost}`);
    return NextResponse.redirect(newUrl.toString(), 301);
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
