import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  // Redirect www to non-www
  if (origin.startsWith('https://www.')) {
    const newOrigin = origin.replace('https://www.', 'https://');
    const newUrl = new URL(pathname, newOrigin);
    return NextResponse.redirect(newUrl, 301);
  }

  return await updateSession(request)
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
