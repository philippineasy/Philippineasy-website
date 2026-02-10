import { createClient, SupabaseClient } from '@supabase/supabase-js';

// This client is safe to use in build steps like sitemap generation
// where there is no user request context.
// Returns null when env vars are missing (e.g. during Vercel build)
// so callers can gracefully return empty data instead of crashing.
export const createBuildClient = (): SupabaseClient | null => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};
