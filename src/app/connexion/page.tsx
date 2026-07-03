'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { MessageCircle, Map as MapIcon, Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Only allow same-origin relative paths as a post-login destination.
 * Blocks protocol-relative (`//evil.com`), absolute URLs and backslash tricks
 * to prevent an open-redirect via `?redirect=`.
 */
function safeRedirect(raw: string | null): string {
  if (!raw) return '/';
  if (!raw.startsWith('/')) return '/';
  if (raw.startsWith('//') || raw.startsWith('/\\')) return '/';
  return raw;
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M23.06 12.25c0-.85-.08-1.67-.22-2.45H12v4.64h6.2a5.3 5.3 0 0 1-2.3 3.48v2.89h3.72c2.18-2 3.44-4.96 3.44-8.56Z" />
      <path fill="#34A853" d="M12 24c3.1 0 5.7-1.03 7.6-2.79l-3.72-2.88c-1.03.69-2.35 1.1-3.88 1.1-2.98 0-5.5-2.01-6.4-4.72H1.75v2.97A11.99 11.99 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.6 14.71a7.2 7.2 0 0 1 0-4.62V7.12H1.75a12 12 0 0 0 0 10.76l3.85-3.17Z" />
      <path fill="#EA4335" d="M12 4.75c1.68 0 3.19.58 4.38 1.71l3.28-3.28C17.7 1.2 15.1 0 12 0A11.99 11.99 0 0 0 1.75 6.12L5.6 9.29C6.5 6.58 9.02 4.75 12 4.75Z" />
    </svg>
  );
}

const PERKS = [
  { Icon: MessageCircle, label: 'Participez aux forums privés.' },
  { Icon: MapIcon, label: 'Enregistrez vos itinéraires.' },
  { Icon: Sparkles, label: 'Recevez des recommandations sur mesure.' },
];

function ConnexionForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = safeRedirect(searchParams.get('redirect'));

  const inputClass =
    'w-full rounded-xl border border-border bg-background px-4 py-2.5 text-[15px] text-foreground placeholder:text-muted-foreground/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-primary';
  const labelClass = 'mb-1.5 block text-[13px] font-medium text-foreground';

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    // Forward the sanitized destination to the callback route, which reads `next`
    // (see src/app/auth/callback/route.ts) and redirects there after exchange.
    const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTarget)}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: callbackUrl },
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const action = isLogin
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password, options: { data: { username } } });

    const { error } = await action;

    if (error) {
      toast.error(error.message);
    } else if (isLogin) {
      toast.success('Connexion réussie !');
      router.push(redirectTarget);
      router.refresh();
    } else {
      toast.success('Inscription réussie ! Veuillez vérifier vos e-mails.');
      router.push('/');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-16 md:py-24">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card">
        <div className="flex flex-col md:flex-row">
          {/* Form Section */}
          <div className="w-full p-7 sm:p-10 md:w-1/2 md:p-12">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-strong">
              Espace membre
            </span>

            <div
              role="tablist"
              aria-label="Choisir connexion ou inscription"
              className="mb-8 inline-flex rounded-full border border-border/70 bg-muted/50 p-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={isLogin}
                onClick={() => setIsLogin(true)}
                className={`rounded-full px-5 py-1.5 text-[14px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isLogin ? 'bg-card text-foreground shadow-card-rest' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Connexion
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={!isLogin}
                onClick={() => setIsLogin(false)}
                className={`rounded-full px-5 py-1.5 text-[14px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  !isLogin ? 'bg-card text-foreground shadow-card-rest' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Inscription
              </button>
            </div>

            <h1 className="mb-6 text-[clamp(1.5rem,3vw,1.875rem)] font-bold leading-tight tracking-[-0.02em] text-ink">
              {isLogin ? (
                <>Connectez-vous à <span className="text-accent-strong">votre compte</span></>
              ) : (
                <>Créez <span className="text-accent-strong">votre compte</span></>
              )}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className={labelClass} htmlFor="username">Nom d&apos;utilisateur</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={inputClass}
                    placeholder="Pseudo"
                    required
                    autoComplete="username"
                  />
                </div>
              )}
              <div>
                <label className={labelClass} htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="votre@email.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                  required
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
              </div>

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label htmlFor="remember" className="flex items-center gap-2 text-[13px] text-muted-foreground">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-accent"
                    />
                    Se souvenir de moi
                  </label>
                  <Link
                    href="/mot-de-passe-oublie"
                    className="rounded text-[13px] font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-[15px] font-semibold text-accent-foreground shadow-cta transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {loading ? 'Chargement…' : isLogin ? 'Connexion' : 'Créer mon compte'}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <hr className="flex-grow border-t border-border/70" />
              <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Ou</span>
              <hr className="flex-grow border-t border-border/70" />
            </div>

            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-border bg-card px-4 py-2.5 text-[14px] font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60"
            >
              <GoogleIcon className="h-[18px] w-[18px]" />
              Continuer avec Google
            </button>

            <div className="mt-8 border-t border-border/60 pt-6 text-center">
              <h2 className="text-[15px] font-semibold text-ink">Vous êtes un professionnel ?</h2>
              <p className="mx-auto mt-1.5 mb-4 max-w-[38ch] text-[13px] text-muted-foreground">
                Mettez en avant votre savoir-faire, vos produits ou vos services auprès de notre communauté de passionnés.
              </p>
              <Link
                href="/marketplace-aux-philippines/vendeur/connexion"
                className="inline-flex items-center rounded-full border border-border bg-card px-5 py-2 text-[13px] font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Devenir Partenaire
              </Link>
            </div>
          </div>

          {/* Info Section */}
          <div className="relative hidden min-h-[520px] w-full md:block md:w-1/2">
            <Image
              src="/imagesHero/boracay-white-beach.webp"
              alt="Plage de sable blanc de Boracay aux Philippines"
              fill
              sizes="(max-width: 768px) 0px, 50vw"
              className="object-cover"
            />
            <div className="relative flex h-full flex-col justify-center bg-gradient-to-b from-primary/85 via-primary/90 to-primary p-10 text-primary-foreground md:p-12">
              <span className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                Rejoignez la communauté
              </span>
              <h2 className="mb-4 text-[clamp(1.75rem,2.5vw,2.25rem)] font-bold leading-tight tracking-[-0.02em]">
                Devenez membre
              </h2>
              <p className="mb-8 max-w-[36ch] text-[15px] leading-relaxed text-primary-foreground/90">
                Accédez à des fonctionnalités exclusives et rejoignez une communauté passionnée par les Philippines.
              </p>
              <ul className="space-y-4">
                {PERKS.map(({ Icon, label }) => (
                  <li key={label} className="flex items-center gap-3.5 text-[15px]">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-accent">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ConnexionFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Loader2 className="h-9 w-9 animate-spin text-primary" aria-hidden="true" />
    </main>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={<ConnexionFallback />}>
      <ConnexionForm />
    </Suspense>
  );
}
