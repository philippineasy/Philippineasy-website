'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { LockKeyhole, ShieldCheck, CircleAlert, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

type Phase = 'verifying' | 'ready' | 'invalid' | 'done';

const MIN_LENGTH = 8;

export default function ResetPasswordForm() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('verifying');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Establish the recovery session. With the implicit flow (see
  // src/utils/supabase/client.ts) the Supabase link puts the token in the URL
  // hash; detectSessionInUrl processes it and fires PASSWORD_RECOVERY. We also
  // check getSession() in case the session is already set (e.g. handled by the
  // auth callback route beforehand).
  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setPhase('ready');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session) {
        setPhase('ready');
        return;
      }
      // No session yet. If a recovery token is still in the URL, give
      // detectSessionInUrl a moment to process it before declaring the link invalid.
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      const hasRecoveryToken = hash.includes('access_token') || hash.includes('type=recovery');
      const delay = hasRecoveryToken ? 6000 : 2500;
      setTimeout(() => {
        if (mounted) setPhase((p) => (p === 'verifying' ? 'invalid' : p));
      }, delay);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < MIN_LENGTH) {
      setError(`Le mot de passe doit contenir au moins ${MIN_LENGTH} caractères.`);
      return;
    }
    if (password !== confirm) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(
        error.message?.toLowerCase().includes('session')
          ? 'Votre lien a expiré. Demandez un nouveau lien de réinitialisation.'
          : "Impossible de mettre à jour le mot de passe. Réessayez.",
      );
      return;
    }

    setPhase('done');
    setTimeout(() => router.push('/profil'), 2200);
  };

  const cardClass =
    'w-full max-w-md rounded-2xl border border-border/60 bg-card p-7 shadow-card sm:p-9';
  const wrapperClass =
    'flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-16 md:py-24';
  const inputClass =
    'w-full rounded-xl border border-border bg-background px-4 py-2.5 pr-11 text-[15px] text-foreground placeholder:text-muted-foreground/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-primary';

  if (phase === 'verifying') {
    return (
      <main className={wrapperClass}>
        <div className={`${cardClass} text-center`}>
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" aria-hidden="true" />
          <p className="mt-4 text-[14.5px] text-muted-foreground">Vérification de votre lien…</p>
        </div>
      </main>
    );
  }

  if (phase === 'invalid') {
    return (
      <main className={wrapperClass}>
        <div className={`${cardClass} text-center`}>
          <span className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive" aria-hidden="true">
            <CircleAlert className="h-6 w-6" />
          </span>
          <h1 className="text-[clamp(1.375rem,3vw,1.75rem)] font-bold tracking-[-0.02em] text-ink">
            Lien invalide ou expiré
          </h1>
          <p className="mx-auto mt-3 max-w-[40ch] text-[14.5px] leading-relaxed text-muted-foreground">
            Ce lien de réinitialisation n&apos;est plus valide. Les liens expirent après un court délai — demandez-en
            un nouveau pour continuer.
          </p>
          <Link
            href="/mot-de-passe-oublie"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[14px] font-semibold text-accent-foreground shadow-cta transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            Demander un nouveau lien
          </Link>
        </div>
      </main>
    );
  }

  if (phase === 'done') {
    return (
      <main className={wrapperClass}>
        <div className={`${cardClass} text-center`}>
          <span className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" aria-hidden="true">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <h1 className="text-[clamp(1.375rem,3vw,1.75rem)] font-bold tracking-[-0.02em] text-ink">
            Mot de passe mis à jour
          </h1>
          <p className="mx-auto mt-3 max-w-[40ch] text-[14.5px] leading-relaxed text-muted-foreground">
            Votre mot de passe a été modifié avec succès. Redirection vers votre espace…
          </p>
          <Link
            href="/profil"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[14px] font-semibold text-accent-foreground shadow-cta transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            Aller à mon profil
          </Link>
        </div>
      </main>
    );
  }

  // phase === 'ready'
  return (
    <main className={wrapperClass}>
      <div className={cardClass}>
        <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary" aria-hidden="true">
          <LockKeyhole className="h-5 w-5" />
        </span>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-strong">
          Espace membre
        </span>
        <h1 className="mt-1.5 text-[clamp(1.375rem,3vw,1.75rem)] font-bold leading-tight tracking-[-0.02em] text-ink">
          Nouveau mot de passe
        </h1>
        <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted-foreground">
          Choisissez un nouveau mot de passe pour votre compte. Il doit contenir au moins {MIN_LENGTH} caractères.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-[13px] font-medium text-foreground">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
                required
                autoComplete="new-password"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm" className="mb-1.5 block text-[13px] font-medium text-foreground">
              Confirmer le mot de passe
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-[15px] text-foreground placeholder:text-muted-foreground/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-primary"
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-[13px] text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-[15px] font-semibold text-accent-foreground shadow-cta transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {loading ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
          </button>
        </form>

        <Link
          href="/connexion"
          className="mt-6 inline-flex items-center gap-1.5 rounded text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Retour à la connexion
        </Link>
      </div>
    </main>
  );
}
