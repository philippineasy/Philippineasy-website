import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// Singleton garanti : un seul client browser par tab. Createur une nouvelle
// instance par appel ferait fork les listeners onAuthStateChange et causerait
// des desynchros (cause classique des "il faut recharger N fois pour voir le
// profil"). Le singleton est lazy + memoise sur globalThis pour survivre
// au HMR Next en dev.
declare global {
  var __supabase_browser__: SupabaseClient | undefined;
}

const getClient = (): SupabaseClient => {
  if (typeof window === 'undefined') {
    // En SSR, ne JAMAIS instancier ce client (il manipule document.cookie).
    // Les composants serveur doivent utiliser src/utils/supabase/server.ts.
    throw new Error('Supabase browser client must not be used on the server.');
  }
  if (!globalThis.__supabase_browser__) {
    globalThis.__supabase_browser__ = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return globalThis.__supabase_browser__;
};

// Proxy pour preserver l'API `import { supabase }` existante sans
// instancier le client au module-load (qui exploserait en SSR).
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return Reflect.get(getClient(), prop);
  },
});

export const createClient = (): SupabaseClient => getClient();
