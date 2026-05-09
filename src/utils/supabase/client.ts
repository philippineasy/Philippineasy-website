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
      {
        auth: {
          // flowType 'implicit' au lieu de 'pkce' (default depuis ssr@0.4+).
          // Audit 2026-05-09 : test recovery email Maryse a echoue avec
          // `otp_expired / Email link is invalid or has expired` apres
          // copy-paste du lien magic-link entre fenetres. Cause = PKCE
          // exige le `code_verifier` localStorage du browser qui a INITIE
          // signInWithOtp (perdu en cross-window/incognito + Gmail anti-
          // phishing pre-click). Implicit flow met le token dans le hash
          // URL : pas de code_verifier, marche cross-browser, robuste aux
          // pre-clicks. Trade-off : token theoriquement exposable via
          // history mais OK pour notre use-case (paiement itineraire 14€,
          // pas data sensible). Cf. https://github.com/supabase/auth/issues/1041
          flowType: 'implicit',
        },
      },
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
