import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { getMainCategoryPath } from '@/lib/utils';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // NOTE: Les redirections www→non-www et http→https sont gérées par vercel.json
  // au niveau CDN pour de meilleures performances. Ne pas dupliquer ici.

  // Redirection pour les anciens articles /article/:slug
  if (pathname.startsWith('/article/')) {
    const slug = pathname.split('/')[2];
    if (slug) {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
              request.cookies.set({ name, value, ...options });
            },
            remove(name: string, options: CookieOptions) {
              request.cookies.set({ name, value: '', ...options });
            },
          },
        }
      );

      const { data: article } = await supabase
        .from('articles')
        .select('category:categories(slug, main_category)')
        .eq('slug', slug)
        .single();

      if (article && article.category) {
        const category = Array.isArray(article.category) ? article.category[0] : article.category;
        const mainCategoryPath = getMainCategoryPath(category.main_category);
        const newUrl = new URL(`/${mainCategoryPath}/${category.slug}/${slug}`, request.url);
        return NextResponse.redirect(newUrl.toString(), 301);
      }
    }
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
